import { AxiosAdapter } from "./http/axios.adapter";

// for example purposes, we are using a fake URL
const baseURL = "http://localhost:3001";

export const servicesFetcher = new AxiosAdapter({
  baseURL
});
