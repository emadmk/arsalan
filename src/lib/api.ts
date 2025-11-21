import axios from 'axios';

// Get API URL from environment variable
// Use empty string for production (nginx proxy) or localhost:5000 for local dev
const API_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; full_name: string }) => {
    const response = await api.post('/api/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  updateProfile: async (data: { full_name?: string; wallet_address?: string }) => {
    const response = await api.put('/api/auth/profile', data);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: { status?: string; category?: string }) => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  getGridPositions: async (productId: string) => {
    const response = await api.get(`/api/products/${productId}/grid`);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (data: { product_id: string; grid_position: number }) => {
    const response = await api.post('/api/orders', data);
    return response.data;
  },

  getById: async (orderId: string) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/api/orders/my-orders');
    return response.data;
  },

  cancelOrder: async (orderId: string) => {
    const response = await api.post(`/api/orders/${orderId}/cancel`);
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  getCurrencies: async () => {
    const response = await api.get('/api/payments/currencies');
    return response.data;
  },

  getEstimate: async (data: {
    amount: number;
    currency_from: string;
    currency_to: string;
  }) => {
    const response = await api.post('/api/payments/estimate', data);
    return response.data;
  },

  createPayment: async (data: {
    order_id: string;
    pay_currency: string;
  }) => {
    const response = await api.post('/api/payments/create', data);
    return response.data;
  },

  getPaymentStatus: async (paymentId: string) => {
    const response = await api.get(`/api/payments/${paymentId}/status`);
    return response.data;
  },
};

// Transactions API
export const transactionsAPI = {
  getByOrderId: async (orderId: string) => {
    const response = await api.get(`/api/transactions/order/${orderId}`);
    return response.data;
  },

  getUserTransactions: async () => {
    const response = await api.get('/api/transactions/my-transactions');
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  getOrders: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/api/admin/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api.put(`/api/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  createProduct: async (data: any) => {
    const response = await api.post('/api/admin/products', data);
    return response.data;
  },

  updateProduct: async (productId: string, data: any) => {
    const response = await api.put(`/api/admin/products/${productId}`, data);
    return response.data;
  },

  deleteProduct: async (productId: string) => {
    const response = await api.delete(`/api/admin/products/${productId}`);
    return response.data;
  },

  issueCertificate: async (orderId: string) => {
    const response = await api.post(`/api/admin/orders/${orderId}/certificate`);
    return response.data;
  },
};

export default api;
