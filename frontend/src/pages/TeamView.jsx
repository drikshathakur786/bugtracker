import { useState, useEffect } from 'react';
import { getMembers, addMember } from '../api/projects';
import AddMemberModal from '../components/common/AddMemberModal';
import { useAuth } from '../context/AuthContext';
import styles from './TeamView.module.css';

function TeamView({ projectId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await getMembers(projectId);
      setMembers(res.data);
    } catch (err) {
      setError('Failed to load team members.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (data) => {
    try {
      await addMember(projectId, data);
      await fetchMembers();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  if (loading) return <p className={styles.empty}>Loading team...</p>;

  const isAdmin = members.some(m => m.userId === user?.id && m.role === 'ADMIN');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Project Team</h3>
        {isAdmin && (
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>
            + Add Member
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.listView}>
        {members.length === 0 ? (
          <p className={styles.empty}>No team members found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} className={styles.tableRow}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td><span className={styles.roleBadge}>{member.role}</span></td>
                  <td className={styles.dateCell}>{new Date(member.joinedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <AddMemberModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddMember}
        />
      )}
    </div>
  );
}

export default TeamView;
