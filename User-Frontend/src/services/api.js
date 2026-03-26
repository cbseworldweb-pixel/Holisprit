import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummy-nj2d.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  sendOtp: (data) => apiClient.post('/auth/otp/send', data),
  verifyOtp: (data) => apiClient.post('/auth/otp/verify', data),
  demoLogin: () => apiClient.post('/auth/demo/user'),
  getMe: () => apiClient.get('/auth/me'),
};

export const movieApi = {
  listMovies: (page = 1, limit = 20, category = null) => {
    let url = `/movies?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    return apiClient.get(url);
  },
  getMovieDetails: (movieId) => apiClient.get(`/movies/${movieId}`),
  watchMovie: (movieId) => apiClient.get(`/user/watch/${movieId}`),
  streamMovie: (movieId) => apiClient.get(`/user/watch/${movieId}/stream`),
};

export const userApi = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    });
    return apiClient.put('/user/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMyMovies: () => apiClient.get('/user/my-movies'),
  getTransactions: (page = 1, limit = 20) =>
    apiClient.get(`/user/transactions?page=${page}&limit=${limit}`),
};

export const paymentApi = {
  createOrder: (movieId) => apiClient.post(`/movies/${movieId}/rent`),
  verifyPayment: (data) => apiClient.post('/payment/verify', data),
  getOrderStatus: (orderId) => apiClient.get(`/payment/order/${orderId}`),
};

export const categoryApi = {
  listCategories: () => apiClient.get('/categories'),
};

export const tagApi = {
  listTags: () => apiClient.get('/tags'),
};

export default apiClient;
