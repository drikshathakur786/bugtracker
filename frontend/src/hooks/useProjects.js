import { useState, useEffect } from 'react';
import { getProjects, createProject } from '../api/projects';

function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all projects when the hook is first used
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (data) => {
    const response = await createProject(data);
    // Add new project to list without refetching everything
    setProjects(prev => [...prev, response.data]);
    return response.data;
  };

  return { projects, loading, error, addProject, refetch: fetchProjects };
}

export default useProjects;