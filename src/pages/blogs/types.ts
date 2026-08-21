export type Blog = {
  id: number;
  slug: string;
  title: string;
  titleHtml: string;
  subtitle?: string | null;
  subtitleHtml?: string | null;
  body: string;
  bodyHtml: string;
  excerpt?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  createdAt?: string;
};

export type GetBlogsResponse = {
  count: number;
  rows: Blog[];
  limit: number;
  offset: number;
};
