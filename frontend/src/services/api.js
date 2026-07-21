import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach Bearer token on each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
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

// ── Auth ────────────────────────────────────────────────
export const authAPI = {
  login:    (credentials) => api.post('/auth/login', credentials),
  register: (data)        => api.post('/auth/register', data),
  logout:   ()            => api.post('/auth/logout'),
  me:       ()            => api.get('/auth/me'),
};

// Helper to handle FormData with PUT in Laravel
const handleUpdate = (url, data) => {
  if (data instanceof FormData) {
    data.append('_method', 'PUT');
    return api.post(url, data);
  }
  return api.put(url, data);
};

// ── Sports ──────────────────────────────────────────────
export const sportsAPI = {
  getAll: (params) => api.get('/sports', { params }),
  getOne: (id)     => api.get(`/sports/${id}`),
  create: (data)   => api.post('/sports', data),
  update: (id, data) => handleUpdate(`/sports/${id}`, data),
  delete: (id)     => api.delete(`/sports/${id}`),
};

// ── Players ─────────────────────────────────────────────
export const playersAPI = {
  getAll: (params) => api.get('/players', { params }),
  getOne: (id)     => api.get(`/players/${id}`),
  create: (data)   => api.post('/players', data),
  update: (id, data) => handleUpdate(`/players/${id}`, data),
  delete: (id)     => api.delete(`/players/${id}`),
};

// ── Teams ───────────────────────────────────────────────
export const teamsAPI = {
  getAll: (params) => api.get('/teams', { params }),
  getOne: (id)     => api.get(`/teams/${id}`),
  create: (data)   => api.post('/teams', data),
  update: (id, data) => handleUpdate(`/teams/${id}`, data),
  delete: (id)     => api.delete(`/teams/${id}`),
};

// ── Matches ─────────────────────────────────────────────
// Note: store/update expect { home_team_id, away_team_id, date, venue }
export const matchesAPI = {
  getAll: (params) => api.get('/matches', { params }),
  getOne: (id)     => api.get(`/matches/${id}`),
  create: (data)   => api.post('/matches', data),
  update: (id, data) => handleUpdate(`/matches/${id}`, data),
  delete: (id)     => api.delete(`/matches/${id}`),
};

// ── Results ─────────────────────────────────────────────
// store/update expect { match_id, home_score, away_score }
export const resultsAPI = {
  getAll: (params) => api.get('/results', { params }),
  getOne: (id)     => api.get(`/results/${id}`),
  create: (data)   => api.post('/results', data),
  update: (id, data) => handleUpdate(`/results/${id}`, data),
  delete: (id)     => api.delete(`/results/${id}`),
};

// ── Rankings ────────────────────────────────────────────
// Supports ?sport_id= filter
export const rankingsAPI = {
  getAll: (params) => api.get('/rankings', { params }),
  create: (data)   => api.post('/rankings', data),
  update: (id, data) => handleUpdate(`/rankings/${id}`, data),
};

// ── Users (Admin) ────────────────────────────────────────
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id)     => api.get(`/users/${id}`),
  create: (data)   => api.post('/users', data),
  update: (id, data) => handleUpdate(`/users/${id}`, data),
  delete: (id)     => api.delete(`/users/${id}`),
};

// ── Dashboard ────────────────────────────────────────────
export const dashboardAPI = {
  getStats:     () => api.get('/dashboard/stats'),
  getChartData: () => api.get('/dashboard/chart'),
};

export default api;
