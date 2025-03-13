import { servicesFetcher } from "@/config/adapters/Services.adapter";
import { Service, ServiceFilters } from "@/types";

export const getServices = async (filters: ServiceFilters = {}): Promise<Service[]> => {
  return servicesFetcher.get('/services');
}