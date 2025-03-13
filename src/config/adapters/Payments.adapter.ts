import { AxiosAdapter } from "./http/axios.adapter";
import { baseURL } from "./http/constants";

export const PaymentsFetcher = new AxiosAdapter({
  baseURL
});
