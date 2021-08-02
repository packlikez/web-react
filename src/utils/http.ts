import axios, { AxiosResponse, AxiosError } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000",
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => ({ error: error.response?.data })
);

interface ErrorResponse {
  error: unknown;
}

type Response = Promise<ErrorResponse | any>;
const http = {
  get: (url: string): Response => instance.get(url),
  post: (url: string, data: unknown): Response => instance.post(url, data),
  patch: (url: string, data: unknown): Response => instance.patch(url, data),
};

export default http;
