import { useNavigate } from 'react-router-dom';
import SeverityBadge from './SeverityBadge';
import styles from './BugCard.module.css';

function BugCard({ bug, innerRef, draggableProps, dragHandleProps }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      onClick={() => navigate(`/bugs/${bug.id}`)}
    >
      <span className={styles.cardId}>{bug.id.substring(0,6).toUpperCase()}</span>
      <h4 className={styles.title}>{bug.title}</h4>
      
      <div className={styles.footer}>
        <SeverityBadge severity={bug.severity} />
        {bug.assigneeName ? (
          <div className={styles.avatar} title={`Assigned to ${bug.assigneeName}`}>
            {bug.assigneeName.charAt(0).toUpperCase()}
          </div>
        ) : (
          <span className={styles.unassigned}>Unassigned</span>
        )}
      </div>
    </div>
  );
}

export default BugCard;