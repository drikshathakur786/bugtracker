import { useState, useEffect } from 'react';
import { getBugs, updateBug, createBug } from '../api/bugs';

function useBugs(projectId) {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (projectId) fetchBugs();
  }, [projectId]);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const response = await getBugs(projectId);
      setBugs(response.data);
    } catch (err) {
      setError('Failed to load bugs');
    } finally {
      setLoading(false);
    }
  };

  const addBug = async (data) => {
    const response = await createBug(data);
    setBugs(prev => [...prev, response.data]);
    return response.data;
  };

  const editBug = async (bugId, data) => {
    const response = await updateBug(bugId, data);
    // Replace the old bug with updated one in state
    setBugs(prev => prev.map(b => b.id === bugId ? response.data : b));
    return response.data;
  };

  // Group bugs by status for the Kanban board
  const bugsByStatus = {
    OPEN: bugs.filter(b => b.status === 'OPEN'),
    IN_PROGRESS: bugs.filter(b => b.status === 'IN_PROGRESS'),
    IN_REVIEW: bugs.filter(b => b.status === 'IN_REVIEW'),
    CLOSED: bugs.filter(b => b.status === 'CLOSED'),
  };

  return { bugs, bugsByStatus, loading, error, addBug, editBug, refetch: fetchBugs };
}

export default useBugs;