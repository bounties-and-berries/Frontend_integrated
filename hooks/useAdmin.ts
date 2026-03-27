import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminDashboardStats, getTransactions, purchaseBerries } from '@/utils/api';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const result = await getAdminDashboardStats();
      if (!result.success) throw new Error('Failed to fetch dashboard stats');
      return result.data;
    },
  });
}

export function useAdminTransactions(limit = 10, offset = 0) {
  return useQuery({
    queryKey: ['admin', 'transactions', limit, offset],
    queryFn: async () => {
      const result = await getTransactions({ limit, offset });
      if (!result.success) throw new Error('Failed to fetch transactions');
      return result.data;
    },
  });
}

export function usePurchaseBerries() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ adminId, quantity, paymentRef }: { adminId: string, quantity: number, paymentRef: string }) => 
      purchaseBerries(adminId, quantity, paymentRef),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}
