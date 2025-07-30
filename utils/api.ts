import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'http://23.21.26.208:3000';//Added Aws EC2 public IPV4 'http://23.21.26.208:3000',http://192.168.111.75:3000

export async function loginApi(name: string, password: string, role: string) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password, role }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Login failed');
  }
  return response.json();
}

async function getAuthHeaders(isFormData = false): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem('token');
  return {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    Authorization: `Bearer ${token}`,
  };
}

// Event (Bounty) APIs
export async function getAllEvents(params: Record<string, string | number | undefined> = {}) {
  const url = new URL(`${BASE_URL}/api/bounties`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.append(key, String(value));
  });
  const headers = await getAuthHeaders();
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
}

export async function getEventById(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/bounties/${id}`, { headers });
  if (!response.ok) throw new Error('Failed to fetch event');
  return response.json();
}

export async function registerForEvent(bountyId: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/bounties/register/${bountyId}`, {
    method: 'POST',
    headers,
  });
  if (!response.ok) throw new Error('Failed to register for event');
  return response.json();
}

export async function createEvent(formData: FormData) {
  const headers = await getAuthHeaders(true);
  const response = await fetch(`${BASE_URL}/api/bounties`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create event');
  return response.json();
}

export async function updateEvent(id: string, formData: FormData) {
  const headers = await getAuthHeaders(true);
  const response = await fetch(`${BASE_URL}/api/bounties/${id}`, {
    method: 'PUT',
    headers,
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to update event');
  return response.json();
}

export async function deleteEvent(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/bounties/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete event');
  return response.json();
}

/**
 * Search events/bounties with filters
 * @param filters - Object containing search parameters
 * @param filters.filters - Object with filter criteria (status, name, type, etc.)
 * @param filters.sortBy - Field to sort by (e.g., 'scheduled_date')
 * @param filters.sortOrder - Sort order ('asc' or 'desc')
 * @param filters.pageNumber - Page number for pagination
 * @param filters.pageSize - Number of items per page
 * @returns Promise with search results including is_registered status
 */
export async function searchEvents(filters: Record<string, any> = {}) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/bounties/search`, {
    method: 'POST',
    headers,
    body: JSON.stringify(filters),
  });
  if (!response.ok) throw new Error('Failed to search events');
  return response.json();
}

export async function getAllEventsAdmin() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/bounties/admin/all`, { headers });
  if (!response.ok) throw new Error('Failed to fetch all events (admin)');
  return response.json();
}

// User APIs
export async function createUser(userData: Record<string, any>) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
}

export async function bulkCreateUsers(file: File | Blob) {
  const headers = await getAuthHeaders(true);
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${BASE_URL}/api/users/bulk`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to bulk create users');
  return response.json();
}

export async function changePassword(data: Record<string, any>) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/users/change-password`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to change password');
  return response.json();
}

export async function updateProfileImage(file: File | Blob) {
  const headers = await getAuthHeaders(true);
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${BASE_URL}/api/users/profile-image`, {
    method: 'PATCH',
    headers,
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to update profile image');
  return response.json();
}

/**
 * Get user's available berries (earned - spent)
 * @returns Promise with user's available berries
 */
export async function getUserAvailableBerries() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/users/available-berries`, { headers });
  if (!response.ok) throw new Error('Failed to fetch available berries');
  return response.json();
}

// Participation APIs
export async function getMyParticipations() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/bounty-participation/my`, { headers });
  if (!response.ok) throw new Error('Failed to fetch your participations');
  return response.json();
}

export async function getBountyParticipants(bountyId: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/bounty-participation/bounty/${bountyId}`, { headers });
  if (!response.ok) throw new Error('Failed to fetch bounty participants');
  return response.json();
}

export async function listParticipations() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/participation/`, { headers });
  if (!response.ok) throw new Error('Failed to list participations');
  return response.json();
}

export async function createParticipation(data: Record<string, any>) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/participation/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create participation');
  return response.json();
}

export async function updateParticipation(id: string, data: Record<string, any>) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/participation/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update participation');
  return response.json();
}

export async function deleteParticipation(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/participation/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete participation');
  return response.json();
}

// Reward APIs
export async function getAllRewards() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/reward`, { headers });
  if (!response.ok) throw new Error('Failed to fetch rewards');
  return response.json();
}

export async function getRewardById(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/reward/${id}`, { headers });
  if (!response.ok) throw new Error('Failed to fetch reward');
  return response.json();
}

export async function searchRewards(filters: Record<string, any> = {}) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/reward/search`, {
    method: 'POST',
    headers,
    body: JSON.stringify(filters),
  });
  if (!response.ok) throw new Error('Failed to search rewards');
  return response.json();
}

export async function claimReward(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/reward/${id}/claim`, {
    method: 'POST',
    headers,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to claim reward');
  }
  return data;
}

export async function getClaimedRewards() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/reward/user/claimed`, { headers });
  if (!response.ok) throw new Error('Failed to fetch claimed rewards');
  return response.json();
}

export async function createReward(data: Record<string, any>, file?: File | Blob) {
  const headers = await getAuthHeaders(true);
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  if (file) formData.append('image', file);
  const response = await fetch(`${BASE_URL}/api/reward`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create reward');
  return response.json();
}

export async function updateReward(id: string, data: Record<string, any>, file?: File | Blob) {
  const headers = await getAuthHeaders(true);
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  if (file) formData.append('image', file);
  const response = await fetch(`${BASE_URL}/api/reward/${id}`, {
    method: 'PUT',
    headers,
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to update reward');
  return response.json();
}

export async function deleteReward(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/reward/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete reward');
  return response.json();
}

// Reward Claim APIs (creator only)
export async function createRewardClaim(data: Record<string, any>) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/reward-claims`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create reward claim');
  return response.json();
}

export async function listRewardClaims() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/reward-claims`, { headers });
  if (!response.ok) throw new Error('Failed to list reward claims');
  return response.json();
}

export async function updateRewardClaim(id: string, data: Record<string, any>) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/reward-claims/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update reward claim');
  return response.json();
}

export async function deleteRewardClaim(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/api/reward-claims/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete reward claim');
  return response.json();
} 