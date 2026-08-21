import apiClient from "@/api/apiClient";
import type { Blog, GetBlogsResponse } from "./types";

type PublicBlogsParams = {
  limit?: number;
  offset?: number;
  category?: string;
};

export const fetchPublicBlogs = async (
  params: PublicBlogsParams = {},
): Promise<GetBlogsResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== undefined),
  );
  const { data } = await apiClient.get<GetBlogsResponse>("/blogs/public", {
    params: cleanParams,
  });
  return data;
};

export const fetchPublicBlogBySlug = async (slug: string): Promise<Blog> => {
  const { data } = await apiClient.get<Blog>(
    `/blogs/public/${encodeURIComponent(slug)}`,
  );
  return data;
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "")
  .toString()
  .replace(/\/$/, "");

export const resolveBlogImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiBaseUrl}${url}`;
};
