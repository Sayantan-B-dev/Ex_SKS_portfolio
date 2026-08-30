import "server-only";

import { createClient } from "@supabase/supabase-js";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  published_at: string;
  created_at: string;
};

export class BlogSchemaMissingError extends Error {
  constructor() {
    super("The public.blog_posts table has not been created.");
    this.name = "BlogSchemaMissingError";
  }
}

const BLOG_COLUMNS =
  "id,title,slug,excerpt,content,cover_image,published_at,created_at";

export function isBlogConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Blog is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getPublishedPosts() {
  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select(BLOG_COLUMNS)
    .order("published_at", { ascending: false });
  if (error?.code === "PGRST205") throw new BlogSchemaMissingError();
  if (error) throw new Error(`Unable to load blog posts: ${error.message}`);
  return (data ?? []) as BlogPost[];
}

export async function getAdminPosts() {
  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select(BLOG_COLUMNS)
    .order("created_at", { ascending: false });
  if (error?.code === "PGRST205") throw new BlogSchemaMissingError();
  if (error) throw new Error(`Unable to load blog posts: ${error.message}`);
  return (data ?? []) as BlogPost[];
}

export async function getPublishedPost(slug: string) {
  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select(BLOG_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error?.code === "PGRST205") throw new BlogSchemaMissingError();
  if (error) throw new Error(`Unable to load blog post: ${error.message}`);
  return data as BlogPost | null;
}

export async function createBlogPost(input: {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
}) {
  const slugBase = input.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = `${slugBase || "post"}-${Date.now().toString(36)}`;
  const { error } = await getSupabase().from("blog_posts").insert({
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content: input.content,
    cover_image: input.coverImage || null,
  });
  if (error) throw new Error(`Unable to publish blog post: ${error.message}`);
  return slug;
}

export async function updateBlogPost(input: {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
}) {
  const { error } = await getSupabase()
    .from("blog_posts")
    .update({
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      cover_image: input.coverImage || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id);
  if (error) throw new Error(`Unable to update blog post: ${error.message}`);
}

export async function deleteBlogPost(id: string) {
  const { error } = await getSupabase().from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(`Unable to delete blog post: ${error.message}`);
}
