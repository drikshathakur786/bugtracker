import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DEVELOPER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await registerApi(formData);
      const { token, name, email, role } = response.data;
      login({ name, email, role }, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* ====== LEFT — Product Showcase ====== */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <div className={styles.brandTag}>
            <img src="/logo.png" alt="" className={styles.brandImage} />
            <span className={styles.brandName}>BugTracker</span>
          </div>

          <h1 className={styles.headline}>
            Your bugs, organized.<br />
            <span className={styles.headlineAccent}>Your team, aligned.</span>
          </h1>

          <p className={styles.tagline}>
            Join development teams using BugTracker to manage issues, 
            track progress with Kanban boards, and ship higher-quality software faster.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={`${styles.featureIcon} ${styles.purple}`}>⊞</div>
              <div className={styles.featureText}>
                <h4>Kanban Boards</h4>
                <p>Drag-and-drop issues across statuses. Visualize your entire sprint at a glance.</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={`${styles.featureIcon} ${styles.blue}`}>◈</div>
              <div className={styles.featureText}>
                <h4>Live Analytics</h4>
                <p>Severity breakdowns, assignee workloads, and trend charts — updated in real time.</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={`${styles.featureIcon} ${styles.green}`}>◉</div>
              <div className={styles.featureText}>
                <h4>Role-Based Access</h4>
                <p>Developers, testers, and admins — each with the right level of control.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Floating mini product preview cards */}
        <div className={styles.floatingCards}>
          <div className={styles.miniCard}>
            <div className={styles.miniDot} style={{ background: '#F85149' }} />
            <span className={styles.miniText}>Payment webhook failing</span>
            <span className={styles.miniStatus} style={{ background: 'rgba(248,81,73,0.15)', color: '#F85149' }}>CRITICAL</span>
          </div>
          <div className={styles.miniCard}>
            <div className={styles.miniDot} style={{ background: '#3FB950' }} />
            <span className={styles.miniText}>Implement 2FA setup flow</span>
            <span className={styles.miniStatus} style={{ background: 'rgba(63,185,80,0.15)', color: '#3FB950' }}>CLOSED</span>
          </div>
          <div className={styles.miniCard}>
            <div className={styles.miniDot} style={{ background: '#E3B341' }} />
            <span className={styles.miniText}>Optimize DB queries</span>
            <span className={styles.miniStatus} style={{ background: 'rgba(227,179,65,0.15)', color: '#E3B341' }}>IN REVIEW</span>
          </div>
        </div>
      </div>

      {/* ====== RIGHT — Register Form ====== */}
      <div className={styles.rightPanel}>
        <div className={styles.card}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="BugTracker" className={styles.logoImage} />
            <span className={styles.logoText}>BugTracker</span>
          </div>
          
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Start tracking issues in under a minute.</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="DEVELOPER">Developer</option>
                <option value="TESTER">Tester</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>

          <p className={styles.link}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;