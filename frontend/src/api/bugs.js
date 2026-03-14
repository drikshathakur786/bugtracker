import api from './axios';

export const getBugs = (projectId, filters = {}) => {
  // Build query string from filters
  const params = { projectId, ...filters };
  return api.get('/bugs', { params });
};

export const getBug = (id) => api.get(`/bugs/${id}`);
export const createBug = (data) => api.post('/bugs', data);
export const updateBug = (id, data) => api.patch(`/bugs/${id}`, data);
export const deleteBug = (id) => api.delete(`/bugs/${id}`);
export const getComments = (bugId) => api.get(`/bugs/${bugId}/comments`);
export const addComment = (bugId, data) => api.post(`/bugs/${bugId}/comments`, data);
export const getAuditLog = (bugId) => api.get(`/bugs/${bugId}/audit`);