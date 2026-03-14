import api from './axios';

export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const addMember = (projectId, data) => api.post(`/projects/${projectId}/members`, data);
export const getMembers = (projectId) => api.get(`/projects/${projectId}/members`);