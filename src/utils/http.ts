import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "localhost:4000",
});

type Response = Promise<AxiosResponse>;
const http = {
  get: (url: string): Response => instance.get(url),
  post: (url: string, data: unknown): Response => instance.post(url, data),
  patch: (url: string, data: unknown): Response => instance.patch(url, data),
};

export default http;
