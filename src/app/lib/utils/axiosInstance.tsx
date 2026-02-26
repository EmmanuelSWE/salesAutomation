import axios from "axios";

export const getAxiosInstance = () => {
  const isBrowser = typeof window !== "undefined";

  const baseURL = isBrowser
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

   
  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
  }

  return axios.create({
    baseURL,
    withCredentials: false,
    headers: { "Content-Type": "application/json" },
  });
};