import { useNavigate } from 'react-router-dom';
import styles from './ProjectCard.module.css';

function ProjectCard({ project }) {
  const navigate = useNavigate();

  // Format date nicely: "Mar 14, 2026"
  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className={styles.header}>
        {/* Show first letter of project name as avatar */}
        <div className={styles.avatar}>
          {project.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className={styles.name}>{project.name}</h3>
          <p className={styles.owner}>by {project.ownerName}</p>
        </div>
      </div>

      {project.description && (
        <p className={styles.description}>{project.description}</p>
      )}

      <div className={styles.footer}>
        <span className={styles.date}>Created {formattedDate}</span>
        <span className={styles.arrow}>→</span>
      </div>
    </div>
  );
}

export default ProjectCard;