import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { MAIN_NAVIGATION_ITEMS } from "@/src/components/layout/navigation";
import { Container } from "@/src/components/shared/container";
import {
  DEFAULT_STORE_NAME,
  formatPhoneDisplay,
} from "@/src/features/settings/lib/store-contact";
import {
  getSafeStoreInfo,
  getStoreContactLinks,
} from "@/src/features/settings/services/settings.service";
import { SERVICE_AREAS } from "@/src/lib/service-areas";

export async function Footer() {
  const [storeInfo, contactLinks] = await Promise.all([
    getSafeStoreInfo(),
    getStoreContactLinks(),
  ]);
  const storeName = storeInfo.storeName || DEFAULT_STORE_NAME;
  const phoneDisplay = formatPhoneDisplay(storeInfo.phone);

  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F8FAFC] pb-24 md:pb-0">
      <Container className="grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <div>
            <p className="text-lg font-bold text-[#111827]">{storeName}</p>
            <p className="mt-1 text-sm text-[#6B7280]">
              Điều hòa, điện máy và dịch vụ điện lạnh tại Kinh Môn, Hải Dương.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-[#374151]">
            {phoneDisplay ? (
              <li>
                <a
                  href={contactLinks.phoneHref}
                  className="inline-flex items-center gap-2 font-bold text-[#111827] hover:text-[#0284C7]"
                >
                  <Phone aria-hidden="true" className="h-4 w-4 text-[#F97316]" />
                  {phoneDisplay}
                </a>
              </li>
            ) : null}
            <li>
              <a
                href={contactLinks.zaloHref}
                className="inline-flex items-center gap-2 hover:text-[#0284C7]"
              >
                <MessageCircle
                  aria-hidden="true"
                  className="h-4 w-4 text-[#0284C7]"
                />
                Nhắn Zalo
              </a>
              <span className="mx-2 text-[#CBD5E1]">·</span>
              <a
                href={contactLinks.facebookHref}
                className="hover:text-[#0284C7]"
              >
                Facebook
              </a>
            </li>
            {storeInfo.address ? (
              <li className="flex items-start gap-2">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0284C7]"
                />
                {storeInfo.address}
              </li>
            ) : null}
            {storeInfo.workingHours ? (
              <li className="flex items-center gap-2">
                <Clock aria-hidden="true" className="h-4 w-4 text-[#0284C7]" />
                {storeInfo.workingHours}
              </li>
            ) : null}
          </ul>
        </div>

        <nav aria-label="Liên kết chân trang">
          <p className="text-sm font-bold text-[#111827]">Danh mục</p>
          <ul className="mt-3 space-y-1">
            {MAIN_NAVIGATION_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-9 items-center text-sm text-[#374151] transition-colors hover:text-[#0284C7]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-bold text-[#111827]">Khu vực phục vụ</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SERVICE_AREAS.map((area) => (
              <li
                key={area}
                className="rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 text-sm text-[#374151]"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-[#E5E7EB]">
        <Container className="py-4 text-xs text-[#6B7280]">
          © {new Date().getFullYear()} {storeName}. Điện máy và điện lạnh
          Kinh Môn, Hải Dương.
        </Container>
      </div>
    </footer>
  );
}
