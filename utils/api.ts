import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const BASE_URL = 'http://192.168.56.1:3000';

export async function loginApi(name: string, password: string, role: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, { name, password, role });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
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
  const headers = await getAuthHeaders();
  try {
    const response = await axios.get(`${BASE_URL}/api/bounties`, { params, headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch events');
  }
}

export async function getEventById(id: string) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.get(`${BASE_URL}/api/bounties/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch event');
  }
}

export async function registerForEvent(bountyId: string) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.post(`${BASE_URL}/api/bounties/register/${bountyId}`, {}, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to register for event');
  }
}

export async function createEvent(formData: FormData) {
  const headers = await getAuthHeaders(true);
  try {
    // Map form fields to bounty API structure
    const bountyFormData = new FormData();
    
    // Map title to name
    const title = formData.get('title') as string;
    if (title) bountyFormData.append('name', title);
    
    // Map description
    const description = formData.get('description') as string;
    if (description) bountyFormData.append('description', description);
    
    // Map date to scheduled_date
    const date = formData.get('date') as string;
    if (date) bountyFormData.append('scheduled_date', date);
    
    // Map venue
    const venue = formData.get('venue') as string;
    if (venue) bountyFormData.append('venue', venue);
    
    // Map points to alloted_points
    const points = formData.get('points') as string;
    if (points) bountyFormData.append('alloted_points', points);
    
    // Map berries
    const berries = formData.get('berries') as string;
    bountyFormData.append('alloted_berries', berries || '0');
    
    // Map type
    const type = formData.get('type') as string;
    bountyFormData.append('type', type || 'event');
    
    // Map capacity
    const capacity = formData.get('capacity') as string;
    bountyFormData.append('capacity', capacity || '50');
    
    // Set as active
    bountyFormData.append('is_active', 'true');
    
    // Map image if present
    const image = formData.get('image') as File;
    if (image) bountyFormData.append('image', image);
    
    console.log('API Request URL:', `${BASE_URL}/api/bounties`);
    console.log('API Request Headers:', headers);
    console.log('API Request Data:', {
      name: title,
      description,
      scheduled_date: date,
      venue,
      alloted_points: points,
      alloted_berries: berries || '0',
      type: type || 'event',
      capacity: capacity || '50',
      is_active: 'true'
    });
    
    const response = await axios.post(`${BASE_URL}/api/bounties`, bountyFormData, { headers });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create event error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create event');
  }
}

export async function updateEvent(id: string, formData: FormData) {
  const headers = await getAuthHeaders(true);
  try {
    const response = await axios.put(`${BASE_URL}/api/bounties/${id}`, formData, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to update event');
  }
}

export async function deleteEvent(id: string) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.delete(`${BASE_URL}/api/bounties/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to delete event');
  }
}

export async function searchEvents(filters: Record<string, any> = {}) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.post(`${BASE_URL}/api/bounties/search`, filters, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to search events');
  }
}

export async function getAllEventsAdmin() {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.get(`${BASE_URL}/api/bounties/admin/all`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch all events (admin)');
  }
}

// User APIs
export async function createUser(userData: {
  mobile: string;
  name: string;
  role: string;
  college_id: number;
}) {
  const headers = await getAuthHeaders();
  const response = await axios.post(`${BASE_URL}/api/users`, userData, { headers });
  return response.data;
}

export async function bulkCreateUsers(file: File | Blob) {
  const headers = await getAuthHeaders(true);
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axios.post(`${BASE_URL}/api/users/bulk`, formData, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to bulk create users');
  }
}

export async function changePassword(data: Record<string, any>) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.post(`${BASE_URL}/api/users/change-password`, data, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to change password');
  }
}

export async function updateProfileImage(file: File | Blob) {
  const headers = await getAuthHeaders(true);
  const formData = new FormData();
  formData.append('image', file);
  try {
    const response = await axios.patch(`${BASE_URL}/api/users/profile-image`, formData, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to update profile image');
  }
}

// Participation APIs
export async function getMyParticipations() {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.get(`${BASE_URL}/api/bounty-participation/my`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch your participations');
  }
}

export async function getBountyParticipants(bountyId: string) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.get(`${BASE_URL}/api/bounty-participation/bounty/${bountyId}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch bounty participants');
  }
}

export async function listParticipations() {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.get(`${BASE_URL}/api/participation/`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to list participations');
  }
}

export async function createParticipation(data: Record<string, any>) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.post(`${BASE_URL}/api/participation/`, data, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to create participation');
  }
}

export async function updateParticipation(id: string, data: Record<string, any>) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.put(`${BASE_URL}/api/participation/${id}`, data, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to update participation');
  }
}

export async function deleteParticipation(id: string) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.delete(`${BASE_URL}/api/participation/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to delete participation');
  }
}

// Reward APIs
export async function getAllRewards() {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.get(`${BASE_URL}/api/reward`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch rewards');
  }
}

export async function getRewardById(id: string) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.get(`${BASE_URL}/api/reward/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch reward');
  }
}

export async function searchRewards(filters: Record<string, any> = {}) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.post(`${BASE_URL}/api/reward/search`, filters, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to search rewards');
  }
}

export async function claimReward(id: string) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.post(`${BASE_URL}/api/reward/${id}/claim`, {}, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to claim reward');
  }
}

export async function getClaimedRewards() {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.get(`${BASE_URL}/api/reward/user/claimed`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch claimed rewards');
  }
}

export async function createReward(data: Record<string, any>, file?: File | Blob) {
  const headers = await getAuthHeaders(true);
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  if (file) formData.append('image', file);
  try {
    const response = await axios.post(`${BASE_URL}/api/reward`, formData, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to create reward');
  }
}

export async function updateReward(id: string, data: Record<string, any>, file?: File | Blob) {
  const headers = await getAuthHeaders(true);
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  if (file) formData.append('image', file);
  try {
    const response = await axios.put(`${BASE_URL}/api/reward/${id}`, formData, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to update reward');
  }
}

export async function deleteReward(id: string) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.delete(`${BASE_URL}/api/reward/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to delete reward');
  }
}

// Reward Claim APIs (creator only)
export async function createRewardClaim(data: Record<string, any>) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.post(`${BASE_URL}/api/reward-claims`, data, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to create reward claim');
  }
}

export async function listRewardClaims() {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.get(`${BASE_URL}/api/reward-claims`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to list reward claims');
  }
}

export async function updateRewardClaim(id: string, data: Record<string, any>) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.put(`${BASE_URL}/api/reward-claims/${id}`, data, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to update reward claim');
  }
}

export async function deleteRewardClaim(id: string) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.delete(`${BASE_URL}/api/reward-claims/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to delete reward claim');
  }
} 