import { useQuery } from "@tanstack/react-query";

/**
 * Hook para obtener el historial de pagos
 */
export function usePayments(filters: Record<string, any> = {}) {
  return useQuery<{
    items: any[];
    total: number;
    offset: number;
    limit: number;
  }, Error>(
    {
      queryKey: ['payments', filters],
      queryFn: () => paymentService.getPayments(filters),
      staleTime: 5 * 60 * 1000,
    }
  );
}