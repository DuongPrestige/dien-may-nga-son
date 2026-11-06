import { MessageCircle, Phone, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MobileNav } from "@/src/components/layout/mobile-nav";
import { MAIN_NAVIGATION_ITEMS } from "@/src/components/layout/navigation";
import { Container } from "@/src/components/shared/container";
import {
  DEFAULT_STORE_NAME,
  formatPhoneDisplay,
} from "@/src/features/settings/lib/store-contact";
import {
  getSafeStoreInfo,
  getStoreContactLinks,
  getTrustContent,
} from "@/src/features/settings/services/settings.service";
import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";

export async function Header() {
  const [storeInfo, contactLinks, trustContent] = await Promise.all([
    getSafeStoreInfo(),
    getStoreContactLinks(),
    getTrustContent(),
  ]);
  const logoSrc = getSafeImageSrc(trustContent.logoUrl);
  const storeName = storeInfo.storeName || DEFAULT_STORE_NAME;
  const phoneDisplay = formatPhoneDisplay(storeInfo.phone);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-[#111827]"
          aria-label={`${storeName} - Trang chủ`}
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt=""
              width={120}
              height={40}
              priority
              unoptimized={shouldUseUnoptimizedImage(logoSrc)}
              className="h-9 w-auto max-w-[120px] shrink-0 object-contain"
            />
          ) : null}
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-base font-bold leading-5 max-[374px]:text-[15px] sm:text-lg">
              {storeName}
            </span>
            <span className="hidden text-xs font-medium text-[#6B7280] sm:block">
              Điện máy và dịch vụ điện lạnh địa phương
            </span>
          </span>
        </Link>

        <nav
          aria-label="Điều hướng chính"
          className="hidden items-center gap-6 text-sm font-medium text-[#111827] md:flex"
        >
          {MAIN_NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[#075985]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/tim-kiem"
            aria-label="Tìm kiếm"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[#111827] transition-colors hover:bg-[#F1F5F9]"
          >
            <Search aria-hidden="true" className="h-5 w-5" />
          </Link>
          <a
            href={contactLinks.phoneHref}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md bg-[#C2410C] px-3 text-sm font-bold text-white transition-colors hover:bg-[#9A3412]"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            <span className="max-[374px]:sr-only lg:hidden">Gọi ngay</span>
            <span className="hidden lg:inline">
              {phoneDisplay || "Gọi ngay"}
            </span>
          </a>
          <a
            href={contactLinks.zaloHref}
            className="hidden min-h-11 items-center gap-2 rounded-md border border-[#0EA5E9] px-3 text-sm font-bold text-[#0369A1] transition-colors hover:bg-[#F0F9FF] sm:inline-flex"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            Zalo
          </a>
          <MobileNav items={MAIN_NAVIGATION_ITEMS} />
        </div>
      </Container>
    </header>
  );
}
