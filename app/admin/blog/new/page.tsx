import type { Metadata } from "next";

import { BlogPostForm } from "@/src/features/blog/components/admin/blog-post-form";
import { getAdminBlogCategories } from "@/src/features/blog/services/blog.service";

export const metadata: Metadata = {
  title: "New blog post | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewBlogPostPage() {
  const categories = await getAdminBlogCategories();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">New blog post</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Create a draft or publish a new SEO article.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <BlogPostForm categories={categories} />
      </div>
    </div>
  );
}
