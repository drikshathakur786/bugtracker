import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { getAnalyticsSummary, getByAssignee, getByStatus } from '../api/analytics';
import styles from './Analytics.module.css';

const SEVERITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH:     '#f59e0b',
  MEDIUM:   '#06b6d4',
  LOW:      '#10b981',
};

const STATUS_COLORS = {
  'OPEN':        '#ef4444',
  'IN PROGRESS': '#f59e0b',
  'IN REVIEW':   '#06b6d4',
  'CLOSED':      '#10b981',
};

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#f1f5f9',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.85rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  itemStyle: { color: '#94a3b8' },
  labelStyle: { color: '#f1f5f9', fontWeight: 600 },
};

const AXIS_STYLE = {
  tick: { fill: '#475569', fontSize: 11, fontFamily: 'DM Sans, sans-serif' },
  axisLine: { stroke: 'rgba(255,255,255,0.06)' },
  tickLine: { stroke: 'transparent' },
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

  if (loading) return (
    <p style={{
      textAlign: 'center',
      padding: '4rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-display)'
    }}>
      Loading analytics...
    </p>
  );

  if (!summary) return null;

  const severityData = Object.entries(summary.bugsBySeverity).map(([name, value]) => ({
    name, value,
  }));

  const typeData = Object.entries(summary.bugsByType).map(([name, value]) => ({
    name, value,
  }));

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.08) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x} y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight={700}
        fontFamily="Syne, sans-serif"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={styles.container}>

      {/* ── STAT CARDS ── */}
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

      {/* ── CHARTS ── */}
      <div className={styles.chartsGrid}>

        {/* Bugs by Severity — Pie */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Bugs by Severity</h3>
          {severityData.length === 0 ? (
            <p className={styles.empty}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={45}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                  strokeWidth={0}
                >
                  {severityData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={SEVERITY_COLORS[entry.name] || '#7c3aed'}
                    />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{
                      color: '#94a3b8',
                      fontSize: '0.8rem',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bugs by Status — Bar */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Bugs by Status</h3>
          {byStatus.length === 0 ? (
            <p className={styles.empty}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={byStatus}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis dataKey="status" {...AXIS_STYLE} />
                <YAxis allowDecimals={false} {...AXIS_STYLE} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {byStatus.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] || '#7c3aed'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bugs by Assignee — Bar */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Bugs by Assignee</h3>
          {byAssignee.length === 0 ? (
            <p className={styles.empty}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={byAssignee}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis dataKey="name" {...AXIS_STYLE} />
                <YAxis allowDecimals={false} {...AXIS_STYLE} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                  fill="url(#assigneeGradient)"
                />
                <defs>
                  <linearGradient id="assigneeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bugs by Type — Bar */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Bugs by Type</h3>
          {typeData.length === 0 ? (
            <p className={styles.empty}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={typeData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis dataKey="name" {...AXIS_STYLE} />
                <YAxis allowDecimals={false} {...AXIS_STYLE} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                  fill="url(#typeGradient)"
                />
                <defs>
                  <linearGradient id="typeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
}

export default Analytics;