const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiBaseUrl = API_URL.replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export async function request(path, options = {}) {
  const token = localStorage.getItem('dineflow_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(payload.message || 'Request failed', response.status, payload);
  }

  return payload;
}

export const api = {
  ownerLogin: (tenant, email, password) => request('/api/auth/owner/login', {
    method: 'POST',
    headers: { 'x-tenant': tenant },
    body: JSON.stringify({ email, password }),
  }),
  employeeLogin: (employeeKey, password) => request('/api/auth/employee/login', {
    method: 'POST',
    body: JSON.stringify({ employeeKey, password }),
  }),
  dashboard: (branchId) => request(`/api/analytics/dashboard${branchId ? `?branchId=${branchId}` : ''}`),
  branches: () => request('/api/restaurant/branches'),
  createBranch: (body) => request('/api/restaurant/branches', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  tables: (branchId) => request(`/api/restaurant/tables${branchId ? `?branchId=${branchId}` : ''}`),
  createTable: (body) => request('/api/restaurant/tables', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  menu: (branchId) => request(`/api/menu${branchId ? `?branchId=${branchId}` : ''}`),
  createCategory: (body) => request('/api/menu/categories', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  createMenuItem: (body) => request('/api/menu/items', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  liveOrders: (branchId) => request(`/api/orders/live${branchId ? `?branchId=${branchId}` : ''}`),
  orders: ({ branchId, status, paymentStatus, limit = 100 } = {}) => {
    const params = new URLSearchParams();
    if (branchId) params.set('branchId', branchId);
    if (status) params.set('status', status);
    if (paymentStatus) params.set('paymentStatus', paymentStatus);
    if (limit) params.set('limit', limit);
    const query = params.toString();
    return request(`/api/orders${query ? `?${query}` : ''}`);
  },
  createOrder: (body) => request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  updateOrderStatus: (id, status) => request(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  createBill: (body) => request('/api/pos/create-bill', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  inventory: (branchId) => request(`/api/inventory${branchId ? `?branchId=${branchId}` : ''}`),
  createInventoryItem: (body) => request('/api/inventory', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  adjustStock: (id, body) => request(`/api/inventory/${id}/adjust`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }),
};
