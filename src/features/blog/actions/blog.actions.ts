"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  BLOG_CACHE_TAG,
  BLOG_DETAIL_CACHE_TAG,
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
} from "@/src/features/blog/services/blog.service";
import type { BlogPostActionState } from "@/src/features/blog/types/blog.types";
import {
  blogPostFormSchema,
  blogPostIdSchema,
} from "@/src/features/blog/validators/blog.validator";

const defaultBlogPostActionState: BlogPostActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

async function requireAdminSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }
}

function formDataToBlogPostInput(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    categoryId: formData.get("categoryId"),
    isPublished: formData.get("isPublished"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  };
}

function getBlogPostFieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): BlogPostActionState["fieldErrors"] {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    title: fieldErrors.title?.[0],
    slug: fieldErrors.slug?.[0],
    excerpt: fieldErrors.excerpt?.[0],
    content: fieldErrors.content?.[0],
    thumbnailUrl: fieldErrors.thumbnailUrl?.[0],
    categoryId: fieldErrors.categoryId?.[0],
    seoTitle: fieldErrors.seoTitle?.[0],
    seoDescription: fieldErrors.seoDescription?.[0],
  };
}

function invalidateBlogCaches(slugs: string[]) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");

  for (const slug of new Set(slugs)) {
    revalidatePath(`/blog/${slug}`);
  }

  updateTag(BLOG_CACHE_TAG);
  updateTag(BLOG_DETAIL_CACHE_TAG);
}

export async function createBlogPostAction(
  _previousState: BlogPostActionState = defaultBlogPostActionState,
  formData: FormData,
): Promise<BlogPostActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedInput = blogPostFormSchema.safeParse(
    formDataToBlogPostInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Please check the blog post information.",
      fieldErrors: getBlogPostFieldErrors(parsedInput.error),
    };
  }

  let createdPost: Awaited<ReturnType<typeof createBlogPost>>;

  try {
    createdPost = await createBlogPost(parsedInput.data);
  } catch {
    return {
      success: false,
      message:
        "Could not create the blog post. Please check the slug, category, and input.",
      fieldErrors: {},
    };
  }

  invalidateBlogCaches([createdPost.slug]);
  redirect("/admin/blog");
}

export async function updateBlogPostAction(
  id: string,
  _previousState: BlogPostActionState = defaultBlogPostActionState,
  formData: FormData,
): Promise<BlogPostActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedId = blogPostIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      success: false,
      message: "Invalid blog post id.",
      fieldErrors: {},
    };
  }

  const parsedInput = blogPostFormSchema.safeParse(
    formDataToBlogPostInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Please check the blog post information.",
      fieldErrors: getBlogPostFieldErrors(parsedInput.error),
    };
  }

  let updatedPost: Awaited<ReturnType<typeof updateBlogPost>>;

  try {
    updatedPost = await updateBlogPost(parsedId.data, parsedInput.data);
  } catch {
    return {
      success: false,
      message:
        "Could not update the blog post. Please check the slug, category, and input.",
      fieldErrors: {},
    };
  }

  revalidatePath(`/admin/blog/${parsedId.data}/edit`);
  invalidateBlogCaches([updatedPost.previousSlug, updatedPost.slug]);
  redirect("/admin/blog");
}

export async function deleteBlogPostAction(formData: FormData) {
  await requireAdminSession();

  const parsedId = blogPostIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return;
  }

  let deletedPost: Awaited<ReturnType<typeof deleteBlogPost>>;

  try {
    deletedPost = await deleteBlogPost(parsedId.data);
  } catch {
    return;
  }

  invalidateBlogCaches([deletedPost.slug]);
}
