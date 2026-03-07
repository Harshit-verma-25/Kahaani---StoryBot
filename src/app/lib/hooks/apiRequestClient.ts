import axios, { Method } from "axios";
import { supabase } from "@/app/lib/supabase/client";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  withCredentials: true,
});

// Generic API request utility
// @param method - HTTP method (GET, POST, PUT, DELETE)
// @param url - API endpoint
// @param data - Request body
// @param params - Query params


export async function apiRequestClient<T>(
  method: Method,
  url: string,
  {
    data,
    params,
  }: {
    data?: Record<string, unknown> | FormData;
    params?: Record<string, unknown>;
  } = {},
): Promise<T> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await api.request<T>({
      method,
      url,
      data,
      params,
      headers: session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : undefined,
    });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(
        `API ${method} ${url} failed`,
        err.response?.data || err.message,
      );
    } else {
      console.error(`API ${method} ${url} failed`, err);
    }
    throw err;
  }
}
