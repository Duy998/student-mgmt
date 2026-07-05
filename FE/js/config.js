const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000/api'
  : '/api';

const TOKEN_KEY = 'sms_access_token';
const USER_KEY = 'sms_current_user';

const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (u) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
  clearUser: () => localStorage.removeItem(USER_KEY),
  clearAll: () => { storage.clearToken(); storage.clearUser(); },
};

/**
 * Core fetch wrapper. Attaches auth header, handles JSON/blob responses,
 * and redirects to login on 401.
 */
async function apiRequest(path, { method = 'GET', body = null, isForm = false, isBlob = false } = {}) {
  const headers = {};
  const token = storage.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let payload = body;
  if (body && !isForm) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { method, headers, body: payload });

  if (res.status === 401) {
    storage.clearAll();
    if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
      window.location.href = 'login.html';
    }
    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
  }

  if (!res.ok) {
    let detail = `Lỗi ${res.status}`;
    try {
      const err = await res.json();
      detail = err.detail || detail;
    } catch (_) {}
    const message = typeof detail === 'string' ? detail : (detail.message || `Lỗi ${res.status}`);
    const error = new Error(message);
    error.detail = detail; // keep structured detail (e.g. { message, errors: [] }) for callers that need it
    throw error;
  }

  if (isBlob) return res.blob();
  if (res.status === 204) return null;
  return res.json();
}

const api = {
  // Auth
  login: (username, password) => {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);
    return apiRequest('/auth/login', { method: 'POST', body: form, isForm: true });
  },
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: data }),
  me: () => apiRequest('/auth/me'),
  changePassword: (data) => apiRequest('/auth/change-password', { method: 'PUT', body: data }),

  // Students
  getStudents: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/students/${qs ? '?' + qs : ''}`);
  },
  getStudent: (id) => apiRequest(`/students/${id}`),
  createStudent: (data) => apiRequest('/students/', { method: 'POST', body: data }),
  updateStudent: (id, data) => apiRequest(`/students/${id}`, { method: 'PUT', body: data }),
  deleteStudent: (id) => apiRequest(`/students/${id}`, { method: 'DELETE' }),
  getStatistics: () => apiRequest('/students/statistics'),
  exportExcel: () => apiRequest('/students/export/excel', { isBlob: true }),
  exportPdf: () => apiRequest('/students/export/pdf', { isBlob: true }),
  downloadImportTemplate: () => apiRequest('/students/import/template', { isBlob: true }),
  importExcel: (file) => {
    const form = new FormData();
    form.append('file', file);
    return apiRequest('/students/import/excel', { method: 'POST', body: form, isForm: true });
  },

  // Users (admin)
  getUsers: () => apiRequest('/users/'),
  updateUser: (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: data }),
  deleteUser: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
};

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

function requireAuth() {
  if (!storage.getToken()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function redirectIfAuthed() {
  if (storage.getToken()) {
    window.location.href = 'dashboard.html';
  }
}