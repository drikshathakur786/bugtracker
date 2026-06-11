import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await loginApi(formData);
      const { token, name, email, role } = response.data;
      login({ name, email, role }, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
            Track every bug.<br />
            <span className={styles.headlineAccent}>Ship with confidence.</span>
          </h1>

          <p className={styles.tagline}>
            A developer-first issue tracker with Kanban boards, real-time analytics, 
            and a complete audit trail — so nothing slips through the cracks.
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
                <h4>Full Audit Trail</h4>
                <p>Every status change, reassignment, and edit is logged with timestamps and authors.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Floating mini product preview cards */}
        <div className={styles.floatingCards}>
          <div className={styles.miniCard}>
            <div className={styles.miniDot} style={{ background: '#F85149' }} />
            <span className={styles.miniText}>Login button broken on Safari</span>
            <span className={styles.miniStatus} style={{ background: 'rgba(248,81,73,0.15)', color: '#F85149' }}>CRITICAL</span>
          </div>
          <div className={styles.miniCard}>
            <div className={styles.miniDot} style={{ background: '#3FB950' }} />
            <span className={styles.miniText}>Add dark mode toggle</span>
            <span className={styles.miniStatus} style={{ background: 'rgba(63,185,80,0.15)', color: '#3FB950' }}>CLOSED</span>
          </div>
          <div className={styles.miniCard}>
            <div className={styles.miniDot} style={{ background: '#E3B341' }} />
            <span className={styles.miniText}>Refactor auth middleware</span>
            <span className={styles.miniStatus} style={{ background: 'rgba(227,179,65,0.15)', color: '#E3B341' }}>IN REVIEW</span>
          </div>
          <div className={styles.miniCard}>
            <div className={styles.miniDot} style={{ background: '#5E6AD2' }} />
            <span className={styles.miniText}>API rate limiting</span>
            <span className={styles.miniStatus} style={{ background: 'rgba(94,106,210,0.15)', color: '#5E6AD2' }}>IN PROGRESS</span>
          </div>
        </div>
      </div>

      {/* ====== RIGHT — Login Form ====== */}
      <div className={styles.rightPanel}>
        <div className={styles.card}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="BugTracker" className={styles.logoImage} />
            <span className={styles.logoText}>BugTracker</span>
          </div>

          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your workspace</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Email</label>
              <input
                name="email" type="email"
                value={formData.email} onChange={handleChange}
                placeholder="developer@example.com" required
              />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input
                name="password" type="password"
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" required
              />
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Authenticating...' : 'Continue →'}
            </button>
          </form>

          <p className={styles.link}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;