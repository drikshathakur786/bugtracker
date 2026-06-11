import { useState } from 'react';
import Modal from './Modal';
import styles from './CreateProjectModal.module.css';

function CreateBugModal({ projectId, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'BUG',
    severity: 'MEDIUM',
    priority: 'MEDIUM',
    projectId: projectId,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bug');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create New Issue" onClose={onClose}>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.field}>
          <label>Title</label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Login button not working on Safari"
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Steps to reproduce, expected vs actual behavior..."
            rows={3}
          />
        </div>

        <div className={styles.selectGrid}>
          <div className={styles.field}>
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="BUG">Bug</option>
              <option value="TASK">Task</option>
              <option value="STORY">Story</option>
              <option value="IMPROVEMENT">Improvement</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Severity</label>
            <select name="severity" value={formData.severity} onChange={handleChange}>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label>Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating...' : 'Create Issue'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateBugModal;