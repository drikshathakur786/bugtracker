import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBug, updateBug, getComments, addComment, getAuditLog, deleteBug } from '../api/bugs';
import { getMembers } from '../api/projects';
import { useAuth } from '../context/AuthContext';
import SeverityBadge from '../components/common/SeverityBadge';
import styles from './BugDetail.module.css';

function BugDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const [auditLog, setAuditLog] = useState([]);

  const [activeTab, setActiveTab] = useState('comments');

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

      const membersRes = await getMembers(bugRes.data.projectId);
      setMembers(membersRes.data);
    } catch (err) {
      console.error('Failed to load bug', err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (field, currentValue) => {
    setEditing(field);
    setEditValue(currentValue);
  };

  const saveEdit = async (field) => {
    try {
      const res = await updateBug(id, { [field]: editValue });
      setBug(res.data);
      setEditing(null);
      // Refresh audit log
      const auditRes = await getAuditLog(id);
      setAuditLog(auditRes.data);
    } catch (err) {
      console.error('Failed to update bug', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug? This action cannot be undone.')) {
      try {
        await deleteBug(id);
        navigate(`/projects/${bug.projectId}`);
      } catch (err) {
        console.error('Failed to delete bug', err);
        alert(err.response?.data?.message || 'Failed to delete bug. Make sure you are an Admin or the Reporter.');
      }
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

  if (loading) return <div className={styles.loading}>Loading issue data...</div>;
  if (!bug) return <div className={styles.loading}>Issue not found</div>;

  const isAdmin = members.some(m => m.email === user?.email && m.role === 'ADMIN');
  const isReporter = bug?.reporterName === user?.name;
  const canDelete = isAdmin || isReporter;

  return (
    <div className={styles.container}>
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
        <div className={styles.main}>
          <div className={styles.titleSection}>
            <span className={styles.bugId}>{bug.id.substring(0,8).toUpperCase()}</span>
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
                <span className={styles.editHint}>Edit</span>
              </h1>
            )}
          </div>

          <div className={styles.section}>
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
                {bug.description || 'Add a description...'}
              </p>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'comments' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments ({comments.length})
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'audit' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('audit')}
              >
                History ({auditLog.length})
              </button>
            </div>

            {activeTab === 'comments' && (
              <div className={styles.commentsSection}>
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

                <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Leave a comment..."
                    rows={2}
                    className={styles.commentInput}
                  />
                  <button
                    type="submit"
                    className={styles.submitComment}
                    disabled={commentLoading || !newComment.trim()}
                  >
                    {commentLoading ? 'Posting...' : 'Post'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className={styles.auditSection}>
                {auditLog.map(log => (
                  <div key={log.id} className={styles.auditEntry}>
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

        <div className={styles.sidebar}>
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

          <div className={styles.field}>
            <label>Reporter</label>
            <span className={styles.value}>{bug.reporterName}</span>
          </div>

          <div className={styles.field}>
            <label>Assignee</label>
            {editing === 'assigneeId' ? (
              <div className={styles.inlineEdit}>
                <select
                  value={editValue || ''}
                  onChange={e => setEditValue(e.target.value)}
                  className={styles.select}
                  autoFocus
                >
                  <option value="">Unassigned</option>
                  {members.map(m => (
                    <option key={m.userId} value={m.userId}>{m.name}</option>
                  ))}
                </select>
                <div className={styles.editActions}>
                  <button onClick={() => saveEdit('assigneeId')} className={styles.saveBtn}>Save</button>
                  <button onClick={() => setEditing(null)} className={styles.cancelBtn}>✕</button>
                </div>
              </div>
            ) : (
              <span
                className={styles.value}
                onClick={() => startEdit('assigneeId', bug.assigneeId)}
                title="Click to edit"
              >
                {bug.assigneeName || 'Unassigned'}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label>Project</label>
            <span className={styles.value}>{bug.projectName}</span>
          </div>

          <div className={styles.field}>
            <label>Created</label>
            <span className={styles.value} style={{ fontFamily: 'var(--font-mono)' }}>
              {new Date(bug.createdAt).toLocaleDateString()}
            </span>
          </div>

          {canDelete && (
            <div className={styles.dangerZone}>
              <button onClick={handleDelete} className={styles.deleteBtn}>
                Delete Bug
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BugDetail;