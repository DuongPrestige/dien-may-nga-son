import { Quote } from "lucide-react";
import Image from "next/image";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { SectionHeading } from "@/src/features/home/components/section-heading";
import { DEFAULT_PUBLIC_TESTIMONIALS_LIMIT } from "@/src/features/testimonials/constants";
import { getActiveTestimonials } from "@/src/features/testimonials/services/testimonials.service";
import type { PublicTestimonial } from "@/src/features/testimonials/types/testimonials.types";
import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";

type TestimonialsSectionProps = {
  limit?: number;
  className?: string;
};

export async function TestimonialsSection({
  limit = DEFAULT_PUBLIC_TESTIMONIALS_LIMIT,
  className,
}: TestimonialsSectionProps) {
  const testimonials = await getActiveTestimonials(limit);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <Section
      padding="compact"
      aria-label="Khách hàng nói gì"
      className={className}
    >
      <Container>
        <SectionHeading
          title="Khách hàng nói gì"
          description="Chia sẻ từ khách hàng đã mua sắm và sử dụng dịch vụ tại Điện Máy Nga Sơn."
        />
        <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: PublicTestimonial }) {
  const avatarSrc = getSafeImageSrc(testimonial.imageUrl);

  return (
    <li className="flex w-[85%] shrink-0 snap-start flex-col rounded-xl border border-[#E5E7EB] bg-white p-4 sm:w-[60%] sm:p-5 lg:w-auto">
      <Quote aria-hidden="true" className="h-7 w-7 text-[#0EA5E9]" />
      <blockquote className="mt-3 flex-1">
        <p className="line-clamp-5 text-sm leading-6 text-[#374151] sm:text-base sm:leading-7">
          {testimonial.content}
        </p>
      </blockquote>
      <div className="mt-4 flex items-center gap-3 border-t border-[#E5E7EB] pt-4">
        {avatarSrc ? (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#E0F2FE]">
            <Image
              src={avatarSrc}
              alt={`Ảnh khách hàng ${testimonial.customerName}`}
              fill
              unoptimized={shouldUseUnoptimizedImage(avatarSrc)}
              sizes="40px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#111827]">
            {testimonial.customerName}
          </p>
          {testimonial.area ? (
            <p className="truncate text-xs text-[#6B7280]">
              {testimonial.area}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}
