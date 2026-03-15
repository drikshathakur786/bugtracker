import { useNavigate } from 'react-router-dom';
import styles from './ProjectCard.module.css';

// Generate a consistent color per project based on name
const gradients = [
  ['#7c3aed', '#06b6d4'],
  ['#db2777', '#7c3aed'],
  ['#059669', '#06b6d4'],
  ['#d97706', '#ef4444'],
  ['#7c3aed', '#ec4899'],
];

function getGradient(name) {
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

function ProjectCard({ project }) {
  const navigate = useNavigate();
  const [c1, c2] = getGradient(project.name);

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className={styles.card} onClick={() => navigate(`/projects/${project.id}`)}>
      {/* Gradient accent bar */}
      <div
        className={styles.accentBar}
        style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}
      />

      <div className={styles.body}>
        <div className={styles.header}>
          <div
            className={styles.avatar}
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
          >
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.arrow}>→</div>
        </div>

        <h3 className={styles.name}>{project.name}</h3>

        {project.description && (
          <p className={styles.description}>{project.description}</p>
        )}

        <div className={styles.footer}>
          <span className={styles.owner}>by {project.ownerName}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;