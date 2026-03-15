import styles from './SeverityBadge.module.css';

// Maps severity to a color class
const severityColors = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

function SeverityBadge({ severity }) {
  return (
    <span className={`${styles.badge} ${styles[severityColors[severity]]}`}>
      {severity}
    </span>
  );
}

export default SeverityBadge;