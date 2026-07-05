// API client for frontend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface FetchOptions extends RequestInit {
  body?: any;
}

export const apiCall = async (
  endpoint: string,
  options: FetchOptions = {}
) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('vault_auth_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: (email: string, password: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: { email, password },
    }),

  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  getCurrentUser: () => apiCall('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: () => apiCall('/products'),
  getById: (id: string) => apiCall(`/products/${id}`),
  createProduct: (product: any) =>
    apiCall('/products', {
      method: 'POST',
      body: product,
    }),
  updateProduct: (id: string, product: any) =>
    apiCall(`/products/${id}`, {
      method: 'PUT',
      body: product,
    }),
  deleteProduct: (id: string) =>
    apiCall(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// Cart API
export const cartAPI = {
  get: () => apiCall('/cart'),

  add: (productId: string, size: string, quantity: number = 1) =>
    apiCall('/cart/add', {
      method: 'POST',
      body: { productId, size, quantity },
    }),

  update: (itemId: string, quantity: number) =>
    apiCall(`/cart/${itemId}`, {
      method: 'PUT',
      body: { quantity },
    }),

  remove: (itemId: string) =>
    apiCall(`/cart/${itemId}`, {
      method: 'DELETE',
    }),

  clear: () =>
    apiCall('/cart', {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersAPI = {
  checkout: (cart: any[], shippingAddress: string) =>
    apiCall('/orders/checkout', {
      method: 'POST',
      body: { cart, shippingAddress },
    }),

  getAll: () => apiCall('/orders'),

  getById: (orderId: string) => apiCall(`/orders/${orderId}`),
};

// Wishlist API
export const wishlistAPI = {
  get: () => apiCall('/wishlist'),

  add: (productId: string) =>
    apiCall('/wishlist/add', {
      method: 'POST',
      body: { productId },
    }),

  remove: (productId: string) =>
    apiCall(`/wishlist/${productId}`, {
      method: 'DELETE',
    }),
};
