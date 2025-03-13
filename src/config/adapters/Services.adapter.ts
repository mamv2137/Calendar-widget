import { AxiosAdapter } from "./http/axios.adapter";
import { baseURL } from "./http/constants";

export const servicesFetcher = new AxiosAdapter({
  baseURL
});
