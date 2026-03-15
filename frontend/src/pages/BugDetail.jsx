import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBug, updateBug, getComments, addComment, getAuditLog } from '../api/bugs';
import { useAuth } from '../context/AuthContext';
import SeverityBadge from '../components/common/SeverityBadge';
import styles from './BugDetail.module.css';

function BugDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Bug data
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Audit log
  const [auditLog, setAuditLog] = useState([]);

  // Active tab: 'comments' or 'audit'
  const [activeTab, setActiveTab] = useState('comments');

  // Editing state — tracks which field is being edited
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [bugRes, commentsRes, auditRes] = await Promise.all([
        getBug(id),
        getComments(id),
        getAuditLog(id),
      ]);
      setBug(bugRes.data);
      setComments(commentsRes.data);
      setAuditLog(auditRes.data);
    } catch (err) {
      console.error('Failed to load bug', err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing a field
  const startEdit = (field, currentValue) => {
    setEditing(field);
    setEditValue(currentValue);
  };

  // Save edited field
  const saveEdit = async (field) => {
    try {
      const response = await updateBug(id, { [field]: editValue });
      setBug(response.data);
      // Refresh audit log to show the change
      const auditRes = await getAuditLog(id);
      setAuditLog(auditRes.data);
    } catch (err) {
      console.error('Failed to update', err);
    } finally {
      setEditing(null);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const response = await addComment(id, { content: newComment });
      setComments(prev => [...prev, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading bug details...</div>;
  if (!bug) return <div className={styles.loading}>Bug not found</div>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className={styles.headerMeta}>
          <SeverityBadge severity={bug.severity} />
          <span className={styles.type}>{bug.type}</span>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Left: Main content */}
        <div className={styles.main}>
          {/* Title */}
          <div className={styles.titleSection}>
            {editing === 'title' ? (
              <div className={styles.inlineEdit}>
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className={styles.titleInput}
                  autoFocus
                />
                <div className={styles.editActions}>
                  <button onClick={() => saveEdit('title')} className={styles.saveBtn}>Save</button>
                  <button onClick={() => setEditing(null)} className={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            ) : (
              <h1
                className={styles.title}
                onClick={() => startEdit('title', bug.title)}
                title="Click to edit"
              >
                {bug.title}
                <span className={styles.editHint}>✏️</span>
              </h1>
            )}
          </div>

          {/* Description */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Description</h3>
            {editing === 'description' ? (
              <div className={styles.inlineEdit}>
                <textarea
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className={styles.descInput}
                  rows={4}
                  autoFocus
                />
                <div className={styles.editActions}>
                  <button onClick={() => saveEdit('description')} className={styles.saveBtn}>Save</button>
                  <button onClick={() => setEditing(null)} className={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            ) : (
              <p
                className={styles.description}
                onClick={() => startEdit('description', bug.description || '')}
                title="Click to edit"
              >
                {bug.description || 'No description. Click to add one.'}
              </p>
            )}
          </div>

          {/* Comments / Audit tabs */}
          <div className={styles.section}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'comments' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                💬 Comments ({comments.length})
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'audit' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('audit')}
              >
                📋 Audit Trail ({auditLog.length})
              </button>
            </div>

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className={styles.commentsSection}>
                {comments.length === 0 && (
                  <p className={styles.empty}>No comments yet. Be the first!</p>
                )}
                {comments.map(comment => (
                  <div key={comment.id} className={styles.comment}>
                    <div className={styles.commentAvatar}>
                      {comment.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.commentBody}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentAuthor}>{comment.authorName}</span>
                        <span className={styles.commentTime}>
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className={styles.commentContent}>{comment.content}</p>
                    </div>
                  </div>
                ))}

                {/* Add comment form */}
                <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className={styles.commentInput}
                  />
                  <button
                    type="submit"
                    className={styles.submitComment}
                    disabled={commentLoading || !newComment.trim()}
                  >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              </div>
            )}

            {/* Audit Trail Tab */}
            {activeTab === 'audit' && (
              <div className={styles.auditSection}>
                {auditLog.length === 0 && (
                  <p className={styles.empty}>No changes recorded yet.</p>
                )}
                {auditLog.map(log => (
                  <div key={log.id} className={styles.auditEntry}>
                    <div className={styles.auditDot} />
                    <div className={styles.auditContent}>
                      <span className={styles.auditAction}>{log.action.replace('_', ' ')}</span>
                      <span className={styles.auditChange}>
                        {log.oldValue} → {log.newValue}
                      </span>
                      <span className={styles.auditMeta}>
                        by {log.changedByName} · {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar with bug properties */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Details</h3>

            {/* Status */}
            <div className={styles.field}>
              <label>Status</label>
              {editing === 'status' ? (
                <div className={styles.inlineEdit}>
                  <select
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className={styles.select}
                    autoFocus
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <div className={styles.editActions}>
                    <button onClick={() => saveEdit('status')} className={styles.saveBtn}>Save</button>
                    <button onClick={() => setEditing(null)} className={styles.cancelBtn}>✕</button>
                  </div>
                </div>
              ) : (
                <span
                  className={styles.statusBadge}
                  onClick={() => startEdit('status', bug.status)}
                  title="Click to edit"
                >
                  {bug.status.replace('_', ' ')}
                </span>
              )}
            </div>

            {/* Priority */}
            <div className={styles.field}>
              <label>Priority</label>
              {editing === 'priority' ? (
                <div className={styles.inlineEdit}>
                  <select
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className={styles.select}
                    autoFocus
                  >
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                  <div className={styles.editActions}>
                    <button onClick={() => saveEdit('priority')} className={styles.saveBtn}>Save</button>
                    <button onClick={() => setEditing(null)} className={styles.cancelBtn}>✕</button>
                  </div>
                </div>
              ) : (
                <span
                  className={styles.value}
                  onClick={() => startEdit('priority', bug.priority)}
                  title="Click to edit"
                >
                  {bug.priority}
                </span>
              )}
            </div>

            {/* Severity */}
            <div className={styles.field}>
              <label>Severity</label>
              {editing === 'severity' ? (
                <div className={styles.inlineEdit}>
                  <select
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className={styles.select}
                    autoFocus
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                  <div className={styles.editActions}>
                    <button onClick={() => saveEdit('severity')} className={styles.saveBtn}>Save</button>
                    <button onClick={() => setEditing(null)} className={styles.cancelBtn}>✕</button>
                  </div>
                </div>
              ) : (
                <span
                  className={styles.value}
                  onClick={() => startEdit('severity', bug.severity)}
                  title="Click to edit"
                >
                  {bug.severity}
                </span>
              )}
            </div>

            {/* Reporter */}
            <div className={styles.field}>
              <label>Reporter</label>
              <span className={styles.value}>{bug.reporterName}</span>
            </div>

            {/* Assignee */}
            <div className={styles.field}>
              <label>Assignee</label>
              <span className={styles.value}>{bug.assigneeName || 'Unassigned'}</span>
            </div>

            {/* Project */}
            <div className={styles.field}>
              <label>Project</label>
              <span className={styles.value}>{bug.projectName}</span>
            </div>

            {/* Dates */}
            <div className={styles.field}>
              <label>Created</label>
              <span className={styles.value}>
                {new Date(bug.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className={styles.field}>
              <label>Updated</label>
              <span className={styles.value}>
                {new Date(bug.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BugDetail;