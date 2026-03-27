import axios from 'axios';
import { Platform } from 'react-native';
import { secureGet, secureDelete } from '@/utils/secureStorage';

// --- Config ---
const getBaseUrl = () => {
  let url = process.env.EXPO_PUBLIC_API_URL;
  if (url) {
    if (Platform.OS === 'android' && url.includes('localhost')) {
      return url.replace('localhost', '10.0.2.2');
    }
    return url;
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:3001';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
};

export const BASE_URL = getBaseUrl();

export const API_ENDPOINTS = {
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  events: '/api/bounties',
  eventById: (id: string) => `/api/bounties/${id}`,
  registerForEvent: (id: string) => `/api/bounties/register/${id}`,
  searchEvents: '/api/bounties/search',
  adminEvents: '/api/bounties/admin/all',
  users: '/api/users',
  bulkCreateUsers: '/api/users/bulk',
  changePassword: '/api/users/change-password',
  updateProfileImage: '/api/users/profile-image',
  userAvailableBerries: '/api/users/stats',
  myParticipations: '/api/bounty-participation/my',
  bountyParticipants: (id: string) => `/api/bounty-participation/bounty/${id}`,
  listParticipations: '/api/bounty-participation/',
  createParticipation: '/api/bounty-participation/',
  updateParticipation: (id: string) => `/api/bounty-participation/${id}`,
  deleteParticipation: (id: string) => `/api/bounty-participation/${id}`,
  rewards: '/api/reward',
  rewardById: (id: string) => `/api/reward/${id}`,
  searchRewards: '/api/reward/search',
  claimReward: (id: string) => `/api/reward/${id}/claim`,
  claimedRewards: '/api/reward/user/claimed',
  rewardClaims: '/api/user-reward-claim',
  rewardClaimById: (id: string) => `/api/user-reward-claim/${id}`,
  rules: '/api/berry-rules',
  ruleById: (id: string) => `/api/berry-rules/${id}`,
  adminProfile: '/api/admin/profile',
  currentUser: '/api/users/me',
};

// --- Helpers ---
export const createFormData = (data: Record<string, any>, file?: File | Blob) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  if (file) {
    formData.append('image', file);
  }
  return formData;
};

// --- Axios Instance ---
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await secureGet('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Token is expired or invalid — clear and redirect to login
    // Don't redirect if we're already trying to login
    // Don't redirect on role-specific errors (INVALID_ROLE, Forbidden for role checks)
    const isLoginRequest = error.config?.url?.includes(API_ENDPOINTS.login);
    const isRoleError = error.response?.data?.error === 'INVALID_ROLE' 
      || (typeof error.response?.data?.error === 'string' && error.response?.data?.error.includes('Forbidden'))
      || error.response?.data?.message?.includes?.('INVALID_ROLE');
    
    if (!isLoginRequest && !isRoleError && error.response?.status === 401) {
      try {
        await secureDelete('token');
        const { router } = await import('expo-router');
        router.replace('/login');
      } catch (clearError) {
        console.error('Error clearing auth data on 401:', clearError);
      }
    }

    const errorMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      (typeof error.response?.data?.error === 'string' ? error.response?.data?.error : null) ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// --- Auth ---
export const loginApi = async (name: string, password: string, role: string) => {
  const response = await api.post(API_ENDPOINTS.login, { name, password, role });
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post(API_ENDPOINTS.logout);
  return response.data;
};

// --- User APIs ---

// --- Events ---
export const getAllEvents = async (params: Record<string, string | number | undefined> = {}) => {
  const response = await api.get(API_ENDPOINTS.events, { params });
  return response.data;
};

export const getEventById = async (id: string) => {
  const response = await api.get(API_ENDPOINTS.eventById(id));
  return response.data;
};

export const registerForEvent = async (bountyId: string) => {
  const response = await api.post(API_ENDPOINTS.registerForEvent(bountyId));
  return response.data;
};

export const createEvent = async (data: Record<string, any>, image?: File | Blob) => {
  const formData = createFormData(data, image);
  const response = await api.post(API_ENDPOINTS.events, formData);
  return response.data;
};

export const updateEvent = async (id: string, data: Record<string, any>, image?: File | Blob) => {
  const formData = createFormData(data, image);
  const response = await api.put(API_ENDPOINTS.eventById(id), formData);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await api.delete(API_ENDPOINTS.eventById(id));
  return response.data;
};

export const searchEvents = async (filters: Record<string, any> = {}) => {
  const response = await api.post(API_ENDPOINTS.searchEvents, filters);
  return response.data;
};

export const getAllEventsAdmin = async () => {
  const response = await api.get(API_ENDPOINTS.adminEvents);
  return response.data;
};

// --- Users ---
export const createUser = async (userData: { mobile: string; name: string; role: string; college_id: number; }) => {
  const response = await api.post(API_ENDPOINTS.users, userData);
  return response.data;
};

export const bulkCreateUsers = async (file: File | Blob) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(API_ENDPOINTS.bulkCreateUsers, formData);
  return response.data;
};

export const changePassword = async (data: Record<string, any>) => {
  const response = await api.post(API_ENDPOINTS.changePassword, data);
  return response.data;
};

export const updateProfileImage = async (file: File | Blob) => {
  const formData = createFormData({}, file);
  const response = await api.patch(API_ENDPOINTS.updateProfileImage, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    } as any,
  });
  return response.data;
};

export const updateProfileImageBase64 = async (base64String: string) => {
  const response = await api.patch(`${API_ENDPOINTS.users}/profile-image-base64`, { image: base64String });
  return response.data;
};

export const getUserAvailableBerries = async () => {
  // Backend provides user stats including available berries at /api/users/stats
  const response = await api.get(API_ENDPOINTS.userAvailableBerries);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get(`${API_ENDPOINTS.currentUser}?t=${Date.now()}`);
  return response.data;
};

// --- Rewards ---
export const getAllRewards = async () => {
  const response = await api.get(API_ENDPOINTS.rewards);
  return response.data;
};

export const getRewardById = async (id: string) => {
  const response = await api.get(API_ENDPOINTS.rewardById(id));
  return response.data;
};

export const searchRewards = async (filters: Record<string, any> = {}) => {
  const response = await api.post(API_ENDPOINTS.searchRewards, filters);
  return response.data;
};

export const claimReward = async (id: string) => {
  const response = await api.post(API_ENDPOINTS.claimReward(id));
  return response.data;
};

export const getClaimedRewards = async () => {
  const response = await api.get(API_ENDPOINTS.claimedRewards);
  return response.data;
};

export const getMyParticipations = async () => {
  const response = await api.get(API_ENDPOINTS.myParticipations);
  return response.data;
};


export const createReward = async (data: Record<string, any>, file?: File | Blob) => {
  const formData = createFormData(data, file);
  const response = await api.post(API_ENDPOINTS.rewards, formData);
  return response.data;
};

export const updateReward = async (id: string, data: Record<string, any>, file?: File | Blob) => {
  const formData = createFormData(data, file);
  const response = await api.put(API_ENDPOINTS.rewardById(id), formData);
  return response.data;
};

export const deleteReward = async (id: string) => {
  const response = await api.delete(API_ENDPOINTS.rewardById(id));
  return response.data;
};

export const createRewardClaim = async (data: Record<string, any>) => {
  const response = await api.post(API_ENDPOINTS.rewardClaims, data);
  return response.data;
};

export const listRewardClaims = async () => {
  const response = await api.get(API_ENDPOINTS.rewardClaims);
  return response.data;
};

export const updateRewardClaim = async (id: string, data: Record<string, any>) => {
  const response = await api.put(API_ENDPOINTS.rewardClaimById(id), data);
  return response.data;
};

export const deleteRewardClaim = async (id: string) => {
  const response = await api.delete(API_ENDPOINTS.rewardClaimById(id));
  return response.data;
};

// --- Rules ---
export const getAllRules = async () => {
  const response = await api.get(API_ENDPOINTS.rules);
  return response.data;
};

export const getRuleById = async (id: string) => {
  const response = await api.get(API_ENDPOINTS.ruleById(id));
  return response.data;
};

export const createRule = async (data: Record<string, any>) => {
  const response = await api.post(API_ENDPOINTS.rules, data);
  return response.data;
};

export const updateRule = async (id: string, data: Record<string, any>) => {
  const response = await api.put(API_ENDPOINTS.ruleById(id), data);
  return response.data;
};

export const deleteRule = async (id: string) => {
  const response = await api.delete(API_ENDPOINTS.ruleById(id));
  return response.data;
};

// --- Admin Profile ---
export const getAdminProfile = async () => {
  const response = await api.get(API_ENDPOINTS.adminProfile);
  return response.data;
};

export const updateAdminProfile = async (data: Record<string, any>) => {
  const response = await api.put(API_ENDPOINTS.adminProfile, data);
  return response.data;
};

// --- New/Missing APIs ---

export const getAllUsers = async (params: Record<string, any> = {}) => {
  const response = await api.get(API_ENDPOINTS.users, { params });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`${API_ENDPOINTS.users}/${id}`);
  return response.data;
};

export const getUserByIdAdmin = async (id: string) => {
  const response = await api.get(`${API_ENDPOINTS.users}/${id}`);
  return response.data;
};

export const updateUserAdmin = async (id: string, data: Record<string, any>) => {
  const response = await api.put(`${API_ENDPOINTS.users}/${id}`, data);
  return response.data;
};

// Get user statistics
// Backend: /api/users/:id/stats (alias: /api/users/stats)
export const getUserStats = async () => {
  const response = await api.get(`${API_ENDPOINTS.users}/stats`);
  return response.data;
};

export const buyBerries = async (userId: string, amount: number) => {
  const response = await api.post(`${API_ENDPOINTS.users}/${userId}/berries`, { amount });
  return response.data;
};

// Get student event participation history
// Backend: GET /api/bounty-participation/my
export const getStudentHistory = async (_studentId: string) => {
  const response = await api.get(API_ENDPOINTS.myParticipations);
  return response.data;
};

export const getStudentAchievements = async (studentId: string) => {
  const response = await api.post('/api/achievements/user', { userId: studentId });
  return response.data;
};

export const requestPoints = async (data: Record<string, any>) => {
  const response = await api.post('/api/point-requests/with-evidence', data);
  return response.data;
};

export const getRedeemedRewards = async (_studentId: string) => {
  const response = await api.get(API_ENDPOINTS.claimedRewards);
  return response.data;
};

// --- Faculty APIs ---
// Get events created by faculty
// Backend: GET /api/bounties/admin/all (aliased as /api/faculty/events)
export const getFacultyEvents = async () => {
  const response = await api.get('/api/faculty/events');
  return response.data;
};

// Get point requests assigned to faculty for review
export const getPendingApprovals = async () => {
  const response = await api.get('/api/point-requests/assigned');
  return response.data;
};

// Approve or deny a point request
export const approvePoints = async (requestId: string, approved: boolean, points?: number) => {
  const action = approved ? 'approve' : 'deny';
  const response = await api.post(`/api/point-requests/${requestId}/${action}`, { points });
  return response.data;
};

// --- Admin APIs ---
// Get admin dashboard statistics
// Backend: /api/admin/dashboard (alias: /api/admin/dashboard-stats)
export const getAdminDashboardStats = async () => {
  const response = await api.get('/api/admin/dashboard-stats');
  return response.data;
};

export const getTransactions = async (params: Record<string, any> = {}) => {
  const response = await api.get('/api/admin/transactions', { params });
  return response.data;
};

export const getStudentsProgress = async () => {
  const response = await api.get('/api/admin/students-progress');
  return response.data;
};

export const purchaseBerries = async (adminId: string, quantity: number, paymentRef: string) => {
  const response = await api.post('/api/admin/purchase-berries', { adminId, quantity, paymentRef });
  return response.data;
};

// --- Notifications ---
export const getNotifications = async () => {
  const response = await api.get('/api/notifications');
  return response.data;
};

export const markNotificationRead = async (id: string) => {
  const response = await api.patch(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch('/api/notifications/read-all');
  return response.data;
};

// --- Search ---
export const globalSearch = async (query: string) => {
  const response = await api.get('/api/search/global', { params: { query } });
  return response.data;
};

// --- Leaderboard ---
// Backend: GET /api/achievements/leaderboard
export const getLeaderboard = async () => {
  const response = await api.get('/api/achievements/leaderboard');
  return response.data;
};

// --- Event Participants ---
export const getEventParticipants = async (eventId: string) => {
  const response = await api.get(API_ENDPOINTS.bountyParticipants(eventId));
  return response.data;
};

// --- User Profile ---
// Backend: PUT /api/users/me
export const updateUserProfile = async (_userId: string, data: Record<string, any>) => {
  const response = await api.put('/api/users/me', data);
  return response.data;
};

// --- Queries ---
export const submitQuery = async (subject: string, message: string) => {
  const response = await api.post('/api/queries', { subject, message });
  return response.data;
};
