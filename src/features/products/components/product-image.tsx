import Image from "next/image";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  priority?: boolean;
};

export function ProductImage({ src, alt, priority = false }: ProductImageProps) {
  if (!src) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-[#E0F2FE] text-sm font-semibold text-[#0284C7]">
        Điện Máy Nga Sơn
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#F8FAFC]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-contain p-3"
      />
    </div>
  );
}

