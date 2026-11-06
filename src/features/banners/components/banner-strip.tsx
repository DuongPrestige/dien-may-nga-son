import Image from "next/image";
import Link from "next/link";

import type { BannerPosition } from "@/src/features/banners/constants";
import { getActiveBanners } from "@/src/features/banners/services/banners.service";
import type { PublicBanner } from "@/src/features/banners/types/banners.types";
import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";

type BannerStripProps = {
  position: BannerPosition;
  className?: string;
};

export async function BannerStrip({ position, className = "" }: BannerStripProps) {
  const banners = await getActiveBanners(position).catch(() => []);
  const visibleBanners = banners.filter((banner) =>
    getSafeImageSrc(banner.imageUrl),
  );

  if (visibleBanners.length === 0) {
    return null;
  }

  const gridClassName =
    visibleBanners.length > 1 ? "grid gap-4 sm:grid-cols-2" : "grid";

  return (
    <div className={`${gridClassName} ${className}`}>
      {visibleBanners.map((banner, index) => (
        <BannerItem
          key={banner.id}
          banner={banner}
          isPriority={index === 0}
          isWide={visibleBanners.length === 1}
        />
      ))}
    </div>
  );
}

type BannerItemProps = {
  banner: PublicBanner;
  isPriority: boolean;
  isWide: boolean;
};

function BannerItem({ banner, isPriority, isWide }: BannerItemProps) {
  const imageSrc = getSafeImageSrc(banner.imageUrl);

  if (!imageSrc) {
    return null;
  }

  const image = (
    <Image
      src={imageSrc}
      alt={banner.title}
      fill
      priority={isPriority}
      unoptimized={shouldUseUnoptimizedImage(imageSrc)}
      sizes={isWide ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
      className="object-cover"
    />
  );
  const frameClassName =
    "relative block aspect-[3/1] overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#E0F2FE]";

  if (!banner.targetUrl) {
    return <div className={frameClassName}>{image}</div>;
  }

  if (banner.targetUrl.startsWith("/")) {
    return (
      <Link
        href={banner.targetUrl}
        className={`${frameClassName} transition-opacity hover:opacity-95`}
      >
        {image}
      </Link>
    );
  }

  return (
    <a
      href={banner.targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${frameClassName} transition-opacity hover:opacity-95`}
    >
      {image}
    </a>
  );
}
