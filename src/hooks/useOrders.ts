import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Order } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!localStorage.getItem('token'),
  });
}
