import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUserAvailableBerries, 
  searchEvents, 
  getUserStats, 
  getLeaderboard,
  getStudentHistory,
  getStudentAchievements,
  requestPoints,
  getRedeemedRewards
} from '@/utils/api';

export function useUserBerries(userId: string | undefined) {
  return useQuery({
    queryKey: ['user', 'berries', userId],
    queryFn: async () => {
      const result = await getUserAvailableBerries();
      return result.data?.berries?.current || result.availableBerries || 0;
    },
    enabled: !!userId,
  });
}

export function useStudentStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['user', 'stats', userId],
    queryFn: async () => {
      const result = await getUserStats();
      return result.data;
    },
    enabled: !!userId,
  });
}

export function useTrendingBounties(limit = 3) {
  return useQuery({
    queryKey: ['bounties', 'trending', limit],
    queryFn: async () => {
      const result = await searchEvents({
        filters: { status: 'trending' },
        sortBy: 'trending_score',
        sortOrder: 'desc',
        pageNumber: 1,
        pageSize: limit,
      });
      return result.results || [];
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const result = await getLeaderboard();
      return result.data || [];
    },
  });
}

export function useHistory(userId: string | undefined) {
  return useQuery({
    queryKey: ['user', 'history', userId],
    queryFn: async () => {
      const result = await getStudentHistory(userId || '');
      return result.participations || [];
    },
    enabled: !!userId,
  });
}

export function useSubmitPointRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => requestPoints(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'point-requests'] });
    },
  });
}

export function usePointRequests() {
    return useQuery({
      queryKey: ['user', 'point-requests'],
      queryFn: async () => {
        const { api } = await import ('@/utils/api');
        const response = await api.get('/api/point-requests/my-requests');
        return response.data.requests || [];
      }
    });
}
