import api from './axios';

// These functions wrap the axios calls so your components
// never deal with URLs directly — just call these functions
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');