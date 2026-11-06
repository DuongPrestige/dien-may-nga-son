import type { Metadata } from "next";

import { TestimonialForm } from "@/src/features/testimonials/components/admin/testimonial-form";

export const metadata: Metadata = {
  title: "Thêm đánh giá | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Thêm đánh giá</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Thêm cảm nhận của khách hàng hiển thị trên trang chủ.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
