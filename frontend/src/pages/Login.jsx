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
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🐛</div>
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
              placeholder="you@example.com" required
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
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className={styles.link}>
          No account? <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;