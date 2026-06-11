import { useNavigate } from 'react-router-dom';
import styles from './ProjectCard.module.css';

const accents = ['#5E6AD2', '#38BDF8', '#3FB950', '#E3B341', '#A371F7'];

function getAccent(name) {
  const index = name.charCodeAt(0) % accents.length;
  return accents[index];
}

function ProjectCard({ project }) {
  const navigate = useNavigate();
  const accent = getAccent(project.name);

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className={styles.card} onClick={() => navigate(`/projects/${project.id}`)}>
      <div
        className={styles.accentBar}
        style={{ background: accent }}
      />

      <div className={styles.body}>
        <div className={styles.header}>
          <div
            className={styles.avatar}
            style={{ background: accent }}
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
          <span className={styles.owner}>{project.ownerName}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;