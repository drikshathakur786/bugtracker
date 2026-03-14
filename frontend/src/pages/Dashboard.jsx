import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Bug Tracker</h1>
        <div className={styles.userInfo}>
          <span>{user?.name}</span>
          <span className={styles.role}>{user?.role}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <h2>Welcome back, {user?.name}! 👋</h2>
        <p>Dashboard coming soon — projects and bugs will appear here.</p>
      </main>
    </div>
  );
}

export default Dashboard;