import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { getAnalyticsSummary, getByAssignee, getByStatus } from '../api/analytics';
import styles from './Analytics.module.css';

// Colors for the pie chart segments
const SEVERITY_COLORS = {
  CRITICAL: '#e53e3e',
  HIGH:     '#ed8936',
  MEDIUM:   '#ecc94b',
  LOW:      '#48bb78',
};

const STATUS_COLORS = {
  'OPEN':        '#e53e3e',
  'IN PROGRESS': '#ecc94b',
  'IN REVIEW':   '#4299e1',
  'CLOSED':      '#48bb78',
};

function Analytics({ projectId }) {
  const [summary, setSummary] = useState(null);
  const [byAssignee, setByAssignee] = useState([]);
  const [byStatus, setByStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [projectId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [summaryRes, assigneeRes, statusRes] = await Promise.all([
        getAnalyticsSummary(projectId),
        getByAssignee(projectId),
        getByStatus(projectId),
      ]);
      setSummary(summaryRes.data);
      setByAssignee(assigneeRes.data);
      setByStatus(statusRes.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading analytics...</p>;
  if (!summary) return null;

  // Convert severity map to array for PieChart
  // [{ name: 'CRITICAL', value: 2 }, { name: 'HIGH', value: 5 }]
  const severityData = Object.entries(summary.bugsBySeverity).map(([name, value]) => ({
    name,
    value,
  }));

  // Convert type map to array for BarChart
  const typeData = Object.entries(summary.bugsByType).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className={styles.container}>

      {/* Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{summary.totalBugs}</div>
          <div className={styles.statLabel}>Total Issues</div>
        </div>
        <div className={`${styles.statCard} ${styles.open}`}>
          <div className={styles.statNumber}>{summary.openBugs}</div>
          <div className={styles.statLabel}>Open</div>
        </div>
        <div className={`${styles.statCard} ${styles.progress}`}>
          <div className={styles.statNumber}>{summary.inProgressBugs}</div>
          <div className={styles.statLabel}>In Progress</div>
        </div>
        <div className={`${styles.statCard} ${styles.closed}`}>
          <div className={styles.statNumber}>{summary.closedBugs}</div>
          <div className={styles.statLabel}>Closed</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className={styles.chartsGrid}>

        {/* Pie Chart — Bugs by Severity */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Bugs by Severity</h3>
          {severityData.length === 0 ? (
            <p className={styles.empty}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {severityData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={SEVERITY_COLORS[entry.name] || '#888'}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart — Bugs by Status */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Bugs by Status</h3>
          {byStatus.length === 0 ? (
            <p className={styles.empty}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {byStatus.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] || '#4f46e5'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart — Bugs by Assignee */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Bugs by Assignee</h3>
          {byAssignee.length === 0 ? (
            <p className={styles.empty}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byAssignee} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart — Bugs by Type */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Bugs by Type</h3>
          {typeData.length === 0 ? (
            <p className={styles.empty}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;