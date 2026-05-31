import { getStoreInfo } from "@/src/features/settings/services/settings.service";
import type { StoreInfo } from "@/src/features/settings/types/settings.types";

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

export async function MobileStickyCTA() {
  const storeInfo = await getSafeStoreInfo();
  const mobileCtaItems = [
    { href: getPhoneHref(storeInfo.phone), label: "Call" },
    { href: storeInfo.zaloUrl || "#", label: "Zalo" },
    { href: storeInfo.facebookUrl || "#", label: "Facebook" },
    { href: "/contact", label: "Quote" },
  ] as const;

  return (
    <nav
      aria-label="Liên hệ nhanh"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E7EB] bg-white shadow-[0_-8px_24px_rgba(17,24,39,0.08)] md:hidden"
    >
      <div className="grid h-16 grid-cols-4">
        {mobileCtaItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center justify-center border-r border-[#E5E7EB] px-1 text-center text-xs font-semibold text-[#111827] last:border-r-0 hover:bg-[#F8FAFC]"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
