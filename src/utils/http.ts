import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "localhost:4000",
});

type Response = Promise<AxiosResponse>;
const http = {
  get: (url: string): Response => instance.get(url),
};

export default http;
