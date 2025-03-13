import axios, { AxiosError, AxiosInstance } from "axios";
import { HttpAdapter } from "./http.adapter";

interface AxiosOptions {
  baseURL: string;
  params?: Record<string, unknown>;
}

export class AxiosAdapter implements HttpAdapter {

  private axiosInstace: AxiosInstance;

  constructor(options: AxiosOptions) {

    this.axiosInstace = axios.create({
      ...options,
    });
  }

  async get(url: string, options?: Record<string, unknown>) {

    try {
      const { data } = await this.axiosInstace.get(url, options);
      return data;
    } catch (err) {
      throw new Error(`Error doing fetch GET: ${(err as AxiosError).message}`);
    }
  }

  async post(url: string, data: Record<string, unknown>, options?: Record<string, unknown>) {
    try {
      const { data: responseData } = await this.axiosInstace.post(url, data, options);
      return responseData;
    } catch (err) {
      throw new Error(`Error doing fetch POST: ${(err as AxiosError).message}`);
    }
  }

  async put(url: string, data: Record<string, unknown>, options?: Record<string, unknown>) {
    try {
      const { data: responseData } = await this.axiosInstace.put(url, data, options);
      return responseData;
    } catch (err) {
      throw new Error(`Error doing fetch PUT: ${(err as AxiosError).message}`);
    }
  }

  async delete(url: string, options?: Record<string, unknown>) {
    try {
      const { data: responseData } = await axios.delete(url, options);
      return responseData;
    } catch (err) {
      throw new Error(`Error doing fetch DELETE: ${(err as AxiosError).message}`);
    }
  }
}
