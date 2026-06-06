import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostForm } from "@/src/features/blog/components/admin/blog-post-form";
import {
  getAdminBlogCategories,
  getAdminBlogPostById,
} from "@/src/features/blog/services/blog.service";

export const metadata: Metadata = {
  title: "Edit blog post | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditBlogPostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getAdminBlogPostById(id),
    getAdminBlogCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Edit blog post</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Update article content, publication status, category, and SEO fields.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <BlogPostForm post={post} categories={categories} />
      </div>
    </div>
  );
}
