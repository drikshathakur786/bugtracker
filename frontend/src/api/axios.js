import axios from 'axios';

// All API calls will be prefixed with this base URL
// So instead of writing http://localhost:8080/api/auth/login every time,
// you just write /auth/login
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// REQUEST INTERCEPTOR
// This runs automatically before EVERY request you make
// It pulls the JWT token from localStorage and adds it to the header
// This means you never have to manually add Authorization header anywhere
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
// This runs automatically after EVERY response
// If the server returns 401 (token expired/invalid),
// we automatically log the user out and redirect to login
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;