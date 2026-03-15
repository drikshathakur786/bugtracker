import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProjects from '../hooks/useProjects';
import ProjectCard from '../components/common/ProjectCard';
import CreateProjectModal from '../components/common/CreateProjectModal';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { projects, loading, error, addProject } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      {/* Top Navigation Bar */}
      <header className={styles.header}>
        <h1 className={styles.logo}>🐛 Bug Tracker</h1>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.name}</span>
          <span className={styles.role}>{user?.role}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h2>My Projects</h2>
            <p className={styles.subtitle}>
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            className={styles.createBtn}
            onClick={() => setShowCreateModal(true)}
          >
            + New Project
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.centered}>
            <p>Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.errorMsg}>{error}</div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className={styles.empty}>
            <p>🗂️</p>
            <h3>No projects yet</h3>
            <p>Create your first project to start tracking bugs</p>
            <button
              className={styles.createBtn}
              onClick={() => setShowCreateModal(true)}
            >
              + Create Project
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className={styles.grid}>
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={addProject}
        />
      )}
    </div>
  );
}

export default Dashboard;