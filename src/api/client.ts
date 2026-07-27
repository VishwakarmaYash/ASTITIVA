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
    let errorMsg = 'API request failed';
    try {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.error || errorJson.message || errorMsg;
      } catch (_) {
        errorMsg = errorText || errorMsg;
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: (email: string, password: string, fullName?: string, phone?: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: { email, password, fullName, phone },
    }),

  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  getCurrentUser: () => apiCall('/auth/me'),

  getCustomers: () => apiCall('/auth/customers'),

  deleteCustomer: (userId: string) =>
    apiCall(`/auth/users/${userId}`, {
      method: 'DELETE',
    }),

  forgotPassword: (email: string) =>
    apiCall('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    }),

  resetPassword: (email: string, token: string, newPassword: string) =>
    apiCall('/auth/reset-password', {
      method: 'POST',
      body: { email, token, password: newPassword },
    }),
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

// Banners API
export const bannersAPI = {
  getActive: (location: string = 'homepage') => apiCall(`/banners?location=${location}`),
  getAllAdmin: () => apiCall('/banners/admin'),
  createBanner: (banner: any) =>
    apiCall('/banners', {
      method: 'POST',
      body: banner,
    }),
  updateBanner: (id: string, banner: any) =>
    apiCall(`/banners/${id}`, {
      method: 'PUT',
      body: banner,
    }),
  deleteBanner: (id: string) =>
    apiCall(`/banners/${id}`, {
      method: 'DELETE',
    }),
};

// Shipping Configuration API
export const shippingAPI = {
  getConfig: () => apiCall('/shipping'),
  updateConfig: (config: any) =>
    apiCall('/shipping', {
      method: 'PUT',
      body: config,
    }),
};

// Cart API
export const cartAPI = {
  get: () => apiCall('/cart'),

  add: (productId: string, size: string, quantity: number = 1, customization?: any) =>
    apiCall('/cart/add', {
      method: 'POST',
      body: { productId, size, quantity, customization },
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

  updateStatus: (orderId: string, status: string) =>
    apiCall(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: { status },
    }),

  deleteOrder: (orderId: string) =>
    apiCall(`/orders/${orderId}`, {
      method: 'DELETE',
    }),
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
