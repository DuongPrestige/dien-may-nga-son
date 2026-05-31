import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { getStoreInfo } from "@/src/features/settings/services/settings.service";
import type { StoreInfo } from "@/src/features/settings/types/settings.types";

const footerLinks = [
  { href: "/products", label: "Sản phẩm" },
  { href: "/services", label: "Dịch vụ" },
  { href: "/blog", label: "Bài viết" },
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

export async function Footer() {
  const storeInfo = await getSafeStoreInfo();
  const storeName = storeInfo.storeName || fallbackStoreInfo.storeName;
  const phoneHref = getPhoneHref(storeInfo.phone);
  const zaloHref = storeInfo.zaloUrl || "#";
  const facebookHref = storeInfo.facebookUrl || "#";

  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F8FAFC] pb-20 md:pb-0">
      <Container className="grid gap-8 py-10 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-3">
          <p className="text-lg font-bold text-[#111827]">{storeName}</p>
          <div className="max-w-xl space-y-1 text-sm leading-6 text-[#6B7280]">
            {storeInfo.address ? <p>{storeInfo.address}</p> : null}
            {storeInfo.workingHours ? <p>{storeInfo.workingHours}</p> : null}
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <a href={phoneHref} className="hover:text-[#0284C7]">
                Điện thoại
              </a>
              <a href={zaloHref} className="hover:text-[#0284C7]">
                Zalo
              </a>
              <a href={facebookHref} className="hover:text-[#0284C7]">
                Facebook
              </a>
            </div>
          </div>
        </div>

        <nav aria-label="Liên kết chân trang" className="grid grid-cols-2 gap-3">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#111827] transition-colors hover:text-[#0284C7]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
