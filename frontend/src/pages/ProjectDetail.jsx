import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBugs from '../hooks/useBugs';
import KanbanBoard from '../components/common/KanbanBoard';
import CreateBugModal from '../components/common/CreateBugModal';
import Analytics from './Analytics';
import { useAuth } from '../context/AuthContext';
import styles from './ProjectDetail.module.css';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bugs, bugsByStatus, loading, error, addBug, editBug } = useBugs(id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('kanban');

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    try {
      await editBug(draggableId, { status: destination.droppableId });
    } catch (err) {
      console.error('Failed to update bug status', err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/dashboard')}
          >
            ← Back
          </button>
          <div>
            <h1 className={styles.title}>Project Detail</h1>
            <p className={styles.subtitle}>{bugs.length} total issues</p>
          </div>
        </div>
        <button
          className={styles.createBtn}
          onClick={() => setShowCreateModal(true)}
        >
          + New Bug
        </button>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'kanban' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('kanban')}
        >
          Kanban Board
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'list' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('list')}
        >
          List View
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'analytics' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Content */}
      <main className={styles.main}>
        {loading && <p className={styles.loading}>Loading bugs...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && activeTab === 'kanban' && (
          <KanbanBoard
            bugsByStatus={bugsByStatus}
            onDragEnd={handleDragEnd}
          />
        )}

        {!loading && activeTab === 'list' && (
          <div className={styles.listView}>
            {bugs.length === 0 ? (
              <p className={styles.empty}>No bugs yet. Create your first one!</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Severity</th>
                    <th>Assignee</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {bugs.map(bug => (
                    <tr
                      key={bug.id}
                      onClick={() => navigate(`/bugs/${bug.id}`)}
                      className={styles.tableRow}
                    >
                      <td>{bug.title}</td>
                      <td><span className={styles.typeBadge}>{bug.type}</span></td>
                      <td><span className={styles.statusBadge}>{bug.status}</span></td>
                      <td>{bug.severity}</td>
                      <td>{bug.assigneeName || '—'}</td>
                      <td>{new Date(bug.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {!loading && activeTab === 'analytics' && (
          <Analytics projectId={id} />
        )}
      </main>

      {showCreateModal && (
        <CreateBugModal
          projectId={id}
          onClose={() => setShowCreateModal(false)}
          onSubmit={addBug}
        />
      )}
    </div>
  );
}

export default ProjectDetail;