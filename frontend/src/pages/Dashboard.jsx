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
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="BugTracker" className={styles.logoImage} />
          BugTracker
        </div>
        <div className={styles.userInfo}>
          <span className={styles.role}>{user?.role}</span>
          <span className={styles.userName}>{user?.name}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h2>Good morning, {user?.name?.split(' ')[0] || 'there'}</h2>
            <p className={styles.subtitle}>
              {projects.length} active project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            className={styles.createBtn}
            onClick={() => setShowCreateModal(true)}
          >
            <span>+</span> New Project
          </button>
        </div>

        {loading && (
          <div className={styles.centered}>
            <p>Loading workspace...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorMsg}>{error}</div>
        )}

        {!loading && projects.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⊞</div>
            <h3>No projects found</h3>
            <p>Get started by creating a new project to track your issues.</p>
            <button
              className={styles.createBtn}
              onClick={() => setShowCreateModal(true)}
              style={{ margin: '0 auto' }}
            >
              New Project
            </button>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className={styles.grid}>
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                style={{ animationDelay: `${index * 30}ms` }}
                className="stagger-slide-up"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </main>

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