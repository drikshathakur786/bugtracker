import { useNavigate } from 'react-router-dom';
import SeverityBadge from './SeverityBadge';
import styles from './BugCard.module.css';

function BugCard({ bug, dragHandleProps, draggableProps, innerRef }) {
  const navigate = useNavigate();

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className={styles.card}
      onClick={() => navigate(`/bugs/${bug.id}`)}
    >
      <p className={styles.title}>{bug.title}</p>
      <div className={styles.footer}>
        <SeverityBadge severity={bug.severity} />
        {bug.assigneeName ? (
          <div className={styles.avatar} title={bug.assigneeName}>
            {bug.assigneeName.charAt(0).toUpperCase()}
          </div>
        ) : (
          <div className={styles.unassigned}>Unassigned</div>
        )}
      </div>
    </div>
  );
}

export default BugCard;