import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { getAnalyticsSummary, getByAssignee, getByStatus } from '../api/analytics';
import styles from './Analytics.module.css';

const SEVERITY_COLORS = {
  CRITICAL: '#EF4444',
  HIGH:     '#F59E0B',
  MEDIUM:   '#3B82F6',
  LOW:      '#10B981',
};

const STATUS_COLORS = {
  'OPEN':        '#8B5CF6',
  'IN PROGRESS': '#3B82F6',
  'IN REVIEW':   '#F59E0B',
  'CLOSED':      '#10B981',
};

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#1C1D21',
    border: '1px solid #2A2C32',
    borderRadius: '4px',
    color: '#EEEEF0',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.8rem',
  },
  itemStyle: { color: '#EEEEF0' },
  labelStyle: { color: '#8A8F98', fontWeight: 600, marginBottom: '0.25rem' },
};

const AXIS_STYLE = {
  tick: { fill: '#8A8F98', fontSize: 10, fontFamily: 'Inter, sans-serif' },
  axisLine: { stroke: '#2A2C32' },
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
      fontFamily: 'var(--font-mono)',
      fontSize: '0.85rem'
    }}>
      Fetching metrics...
    </p>
  );

  if (!summary) return null;

  const severityData = Object.entries(summary.bugsBySeverity).map(([name, value]) => ({
    name, value,
  }));

  const typeData = Object.entries(summary.bugsByType).map(([name, value]) => ({
    name, value,
  }));

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
        fontSize={10}
        fontWeight={600}
        fontFamily="Inter, sans-serif"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={styles.container}>
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

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Severity Distribution</h3>
          {severityData.length === 0 ? (
            <p className={styles.empty}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                  strokeWidth={0}
                >
                  {severityData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={SEVERITY_COLORS[entry.name] || '#5E6AD2'}
                    />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend
                  iconType="circle"
                  iconSize={6}
                  formatter={(value) => (
                    <span style={{
                      color: '#8A8F98',
                      fontSize: '0.75rem',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500
                    }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Status Breakdown</h3>
          {byStatus.length === 0 ? (
            <p className={styles.empty}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={byStatus}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2A2C32"
                  vertical={false}
                />
                <XAxis dataKey="status" {...AXIS_STYLE} />
                <YAxis allowDecimals={false} {...AXIS_STYLE} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={32}>
                  {byStatus.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] || '#5E6AD2'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Workload by Assignee</h3>
          {byAssignee.length === 0 ? (
            <p className={styles.empty}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={byAssignee}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2A2C32"
                  vertical={false}
                />
                <XAxis dataKey="name" {...AXIS_STYLE} />
                <YAxis allowDecimals={false} {...AXIS_STYLE} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar
                  dataKey="count"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={32}
                  fill="#5E6AD2"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Issue Types</h3>
          {typeData.length === 0 ? (
            <p className={styles.empty}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={typeData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2A2C32"
                  vertical={false}
                />
                <XAxis dataKey="name" {...AXIS_STYLE} />
                <YAxis allowDecimals={false} {...AXIS_STYLE} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar
                  dataKey="value"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={32}
                  fill="#38BDF8"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;