import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { getStoreInfo } from "@/src/features/settings/services/settings.service";
import type { StoreInfo } from "@/src/features/settings/types/settings.types";

const navigationItems = [
  { href: "/products", label: "Sản phẩm" },
  { href: "/services", label: "Dịch vụ" },
  { href: "/blog", label: "Kinh nghiệm" },
  { href: "/contact", label: "Liên hệ" },
] as const;

const fallbackStoreInfo: StoreInfo = {
  storeName: "Điện Máy Nga Sơn",
  phone: "",
  zaloUrl: "",
  facebookUrl: "",
  address: "",
  workingHours: "",
};

async function getSafeStoreInfo(): Promise<StoreInfo> {
  try {
    return await getStoreInfo();
  } catch {
    return fallbackStoreInfo;
  }
}

function getPhoneHref(phone: string): string {
  return phone ? `tel:${phone}` : "#";
}

export async function Header() {
  const storeInfo = await getSafeStoreInfo();
  const phoneHref = getPhoneHref(storeInfo.phone);
  const zaloHref = storeInfo.zaloUrl || "#";

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex min-w-0 flex-col text-[#111827]"
          aria-label={storeInfo.storeName || fallbackStoreInfo.storeName}
        >
          <span className="truncate text-base font-bold leading-5 sm:text-lg">
            {storeInfo.storeName || fallbackStoreInfo.storeName}
          </span>
          <span className="hidden text-xs font-medium text-[#6B7280] sm:block">
            Điện máy và dịch vụ điện lạnh địa phương
          </span>
        </Link>

        <nav
          aria-label="Điều hướng chính"
          className="hidden items-center gap-6 text-sm font-medium text-[#111827] md:flex"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[#0284C7]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={phoneHref}
            className="rounded-md bg-[#F97316] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ea580c]"
          >
            Gọi ngay
          </a>
          <a
            href={zaloHref}
            className="hidden rounded-md border border-[#0EA5E9] px-3 py-2 text-sm font-semibold text-[#0284C7] transition-colors hover:bg-[#F8FAFC] sm:inline-flex"
          >
            Zalo
          </a>
        </div>
      </Container>
    </header>
  );
}
