import { LeadSourceType } from "@prisma/client";
import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { LeadForm } from "@/src/features/leads/components/lead-form";
import {
  getSettingByKey,
  getStoreInfo,
} from "@/src/features/settings/services/settings.service";
import type { StoreInfo } from "@/src/features/settings/types/settings.types";

export const metadata: Metadata = {
  title: "Liên hệ Điện Máy Nga Sơn | Kinh Môn, Hải Dương",
  description:
    "Liên hệ Điện Máy Nga Sơn tại Quang Thành, Kinh Môn, Hải Dương để tư vấn mua điều hòa, thiết bị điện máy, sửa chữa và bảo dưỡng điện lạnh.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Liên hệ Điện Máy Nga Sơn | Kinh Môn, Hải Dương",
    description:
      "Gọi, nhắn Zalo, liên hệ Facebook hoặc gửi yêu cầu báo giá cho Điện Máy Nga Sơn tại Quang Thành, Kinh Môn, Hải Dương.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liên hệ Điện Máy Nga Sơn | Kinh Môn, Hải Dương",
    description:
      "Thông tin liên hệ và form tư vấn cho khách hàng địa phương tại Kinh Môn, Hải Dương.",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const fallbackStoreInfo: StoreInfo = {
  storeName: "Điện Máy Nga Sơn",
  phone: "",
  zaloUrl: "",
  facebookUrl: "",
  address: "Quang Thành - Kinh Môn - Hải Dương",
  workingHours: "",
};

function getDisplayValue(value: string, fallback = "Đang cập nhật"): string {
  return value.trim() || fallback;
}

function getPhoneHref(phone: string): string {
  return phone.trim() ? `tel:${phone.trim()}` : "#";
}

function getUrlHref(url: string): string {
  return url.trim() || "#";
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getMapSrc(mapSetting: string): string {
  const trimmed = mapSetting.trim();

  if (!trimmed) {
    return "";
  }

  if (isHttpUrl(trimmed)) {
    return trimmed;
  }

  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  const src = srcMatch?.[1] ?? "";

  return isHttpUrl(src) ? src : "";
}

function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

function buildLocalBusinessSchema(storeInfo: StoreInfo, mapSrc: string) {
  const baseUrl = getBaseUrl();
  const sameAs = [storeInfo.zaloUrl, storeInfo.facebookUrl].filter((url) =>
    isHttpUrl(url),
  );

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: getDisplayValue(storeInfo.storeName, fallbackStoreInfo.storeName),
    url: `${baseUrl}/contact`,
    telephone: storeInfo.phone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: getDisplayValue(
        storeInfo.address,
        fallbackStoreInfo.address,
      ),
      addressLocality: "Kinh Môn",
      addressRegion: "Hải Dương",
      addressCountry: "VN",
    },
    openingHours: storeInfo.workingHours || undefined,
    hasMap: mapSrc || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    areaServed: ["Quang Thành", "Kinh Môn", "Hải Dương"],
  };
}

async function getSafeStoreInfo(): Promise<StoreInfo> {
  try {
    return await getStoreInfo();
  } catch {
    return fallbackStoreInfo;
  }
}

async function getSafeGoogleMapEmbed(): Promise<string> {
  try {
    return await getSettingByKey("google_map_embed");
  } catch {
    return "";
  }
}

export default async function ContactPage() {
  const [storeInfo, googleMapEmbed] = await Promise.all([
    getSafeStoreInfo(),
    getSafeGoogleMapEmbed(),
  ]);
  const mapSrc = getMapSrc(googleMapEmbed);
  const phoneHref = getPhoneHref(storeInfo.phone);
  const zaloHref = getUrlHref(storeInfo.zaloUrl);
  const facebookHref = getUrlHref(storeInfo.facebookUrl);
  const localBusinessSchema = buildLocalBusinessSchema(storeInfo, mapSrc);

  const contactRows = [
    {
      label: "Cửa hàng",
      value: getDisplayValue(storeInfo.storeName, fallbackStoreInfo.storeName),
    },
    {
      label: "Điện thoại",
      value: getDisplayValue(storeInfo.phone),
    },
    {
      label: "Zalo",
      value: getDisplayValue(storeInfo.zaloUrl),
    },
    {
      label: "Facebook",
      value: getDisplayValue(storeInfo.facebookUrl),
    },
    {
      label: "Địa chỉ",
      value: getDisplayValue(storeInfo.address, fallbackStoreInfo.address),
    },
    {
      label: "Giờ làm việc",
      value: getDisplayValue(storeInfo.workingHours),
    },
  ] as const;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <Section className="bg-[#F8FAFC] py-10 sm:py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-sm font-bold uppercase text-[#0284C7]">
                Liên hệ cửa hàng
              </p>
              <h1 className="text-3xl font-bold leading-tight text-[#111827] sm:text-5xl">
                Liên hệ Điện Máy Nga Sơn
              </h1>
              <p className="text-base leading-7 text-[#6B7280]">
                Điện Máy Nga Sơn hỗ trợ tư vấn mua điều hòa, tivi, tủ lạnh, máy
                giặt và các dịch vụ sửa chữa, bảo dưỡng điện lạnh cho khách hàng
                tại Quang Thành, Kinh Môn, Hải Dương.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={phoneHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
                >
                  Gọi ngay
                </a>
                <a
                  href={zaloHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] bg-white px-5 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
                >
                  Nhắn Zalo
                </a>
                <a
                  href={facebookHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#2563EB] bg-white px-5 text-sm font-bold text-[#2563EB] hover:bg-[#EFF6FF]"
                >
                  Liên hệ Facebook
                </a>
                <a
                  href="#bao-gia"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-5 text-sm font-bold text-[#111827] hover:bg-white"
                >
                  Gửi yêu cầu báo giá
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)]">
              <h2 className="text-xl font-bold text-[#111827]">
                Thông tin cửa hàng
              </h2>
              <dl className="mt-5 space-y-4">
                {contactRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-1 border-b border-[#E5E7EB] pb-4 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-sm font-semibold text-[#6B7280]">
                      {row.label}
                    </dt>
                    <dd className="text-base font-bold leading-7 text-[#111827]">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Phục vụ khách hàng địa phương
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                Nếu bạn ở Quang Thành, Kinh Môn hoặc khu vực Hải Dương và cần
                tư vấn thiết bị điện máy, lắp đặt điều hòa, bảo dưỡng điều hòa,
                sửa tủ lạnh hoặc sửa máy giặt, hãy liên hệ cửa hàng để được tư
                vấn phương án phù hợp.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-sm font-bold text-[#111827]">Tư vấn nhanh</p>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  Gọi hoặc nhắn Zalo để mô tả nhu cầu trước.
                </p>
              </div>
              <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-sm font-bold text-[#111827]">
                  Ưu tiên địa phương
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  Nội dung tư vấn tập trung cho Kinh Môn, Hải Dương.
                </p>
              </div>
              <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-sm font-bold text-[#111827]">
                  Báo rõ nhu cầu
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  Form ngắn giúp cửa hàng liên hệ lại chính xác hơn.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F8FAFC]">
              {mapSrc ? (
                <iframe
                  src={mapSrc}
                  title="Bản đồ Điện Máy Nga Sơn"
                  className="h-80 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex min-h-64 items-center justify-center p-6 text-center">
                  <div>
                    <h2 className="text-xl font-bold text-[#111827]">
                      Bản đồ đang được cập nhật
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B7280]">
                      Địa chỉ cửa hàng:{" "}
                      {getDisplayValue(
                        storeInfo.address,
                        fallbackStoreInfo.address,
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside
            id="bao-gia"
            className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)] sm:p-6"
          >
            <h2 className="text-2xl font-bold text-[#111827]">
              Gửi yêu cầu báo giá
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">
              Để lại tên, số điện thoại và nội dung cần tư vấn. Điện Máy Nga
              Sơn sẽ liên hệ lại trong thời gian sớm nhất.
            </p>
            <LeadForm
              className="mt-5"
              sourceType={LeadSourceType.CONTACT}
              sourceUrl="/contact"
            />
          </aside>
        </Container>
      </Section>
    </>
  );
}
