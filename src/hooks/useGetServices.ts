// src/hooks/useServices.ts
import { Service, ServiceFilters } from '@/types';
import { useQuery } from '@tanstack/react-query';
import * as ServiceFetcher from '@/services/services';

export function useGetServices(filters: ServiceFilters = {}) {
  return useQuery<Service[], Error>(
    {
      queryKey: ['services', filters],
      queryFn: () => ServiceFetcher.getServices(filters),
    }
  );
}