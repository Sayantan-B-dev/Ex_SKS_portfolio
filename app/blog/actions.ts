"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authenticate, clearSession, isAuthenticated } from "@/lib/blog-auth";
import { createBlogPost, deleteBlogPost, updateBlogPost } from "@/lib/blog";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (await authenticate(username, password)) redirect("/blog/admin");
  redirect("/blog/admin?error=login");
}

export async function logoutAction() {
  await clearSession();
  redirect("/blog/admin");
}

export async function publishAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/blog/admin?error=session");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  if (!title || !excerpt || !content) redirect("/blog/admin?error=required");
  await createBlogPost({ title, excerpt, content, coverImage });
  revalidatePath("/blog");
  redirect("/blog/admin?published=1");
}

export async function updateAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/blog/admin?error=session");
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  if (!id || !title || !excerpt || !content) redirect("/blog/admin?error=required");
  await updateBlogPost({ id, title, excerpt, content, coverImage });
  revalidatePath("/blog");
  redirect("/blog/admin?updated=1");
}

export async function deleteAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/blog/admin?error=session");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/blog/admin?error=missing");
  await deleteBlogPost(id);
  revalidatePath("/blog");
  redirect("/blog/admin?deleted=1");
}
