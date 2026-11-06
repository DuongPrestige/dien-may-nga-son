import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TestimonialForm } from "@/src/features/testimonials/components/admin/testimonial-form";
import { getAdminTestimonialById } from "@/src/features/testimonials/services/testimonials.service";
import { testimonialIdSchema } from "@/src/features/testimonials/validators/testimonial.validator";

export const metadata: Metadata = {
  title: "Sửa đánh giá | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditTestimonialPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTestimonialPage({
  params,
}: EditTestimonialPageProps) {
  const { id } = await params;
  const parsedId = testimonialIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const testimonial = await getAdminTestimonialById(parsedId.data);

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Sửa đánh giá</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Cập nhật nội dung, ảnh, thứ tự và trạng thái hiển thị của đánh giá.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <TestimonialForm testimonial={testimonial} />
      </div>
    </div>
  );
}
