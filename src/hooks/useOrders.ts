import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI, adminAPI } from '../lib/api';
import type { Order } from '../types';
import { useAuthStore } from '../store/auth';

export function useOrders() {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const response = await ordersAPI.getUserOrders();
      return response.orders as Order[];
    },
    enabled: !!user,
  });
}

export function useAdminOrders() {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await adminAPI.getOrders();
      return response.orders as Order[];
    },
    enabled: user?.role === 'admin',
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: { product_id: string; grid_position: number }) => {
      const response = await ordersAPI.create(orderData);
      return response.order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await adminAPI.updateOrderStatus(id, status);
      return response.order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
}
