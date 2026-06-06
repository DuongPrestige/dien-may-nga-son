import Image from "next/image";

import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";

type ProductImageProps = {
  src: string | null | undefined;
  alt: string;
  priority?: boolean;
};

export function ProductImage({ src, alt, priority = false }: ProductImageProps) {
  const safeSrc = getSafeImageSrc(src);

  if (!safeSrc) {
    return (
      <div
        role="img"
        aria-label={`${alt} image unavailable`}
        className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-[#E0F2FE] px-4 text-center text-sm font-semibold text-[#0284C7]"
      >
        Hình ảnh đang cập nhật
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#F8FAFC]">
      <Image
        src={safeSrc}
        alt={alt}
        fill
        priority={priority}
        unoptimized={shouldUseUnoptimizedImage(safeSrc)}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-contain p-3"
      />
    </div>
  );
}

