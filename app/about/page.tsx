import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { getStoreInfo } from "@/src/features/settings/services/settings.service";
import type { StoreInfo } from "@/src/features/settings/types/settings.types";
import { serializeJsonLd } from "@/src/lib/schema";

export const metadata: Metadata = {
  title: "Giới thiệu Điện Máy Nga Sơn | Kinh Môn, Hải Dương",
  description:
    "Tìm hiểu Điện Máy Nga Sơn tại Quang Thành, Kinh Môn, Hải Dương: cửa hàng điện máy địa phương chuyên điều hòa, tivi, tủ lạnh, máy giặt và dịch vụ điện lạnh.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Giới thiệu Điện Máy Nga Sơn | Kinh Môn, Hải Dương",
    description:
      "Điện Máy Nga Sơn là cửa hàng điện máy địa phương tại Quang Thành, Kinh Môn, Hải Dương, tập trung tư vấn sản phẩm và dịch vụ điện lạnh cho gia đình.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giới thiệu Điện Máy Nga Sơn | Kinh Môn, Hải Dương",
    description:
      "Cửa hàng điện máy địa phương phục vụ khách hàng tại Quang Thành, Kinh Môn, Hải Dương.",
  },
};

export const revalidate = 3600;

const fallbackStoreInfo: StoreInfo = {
  storeName: "Điện Máy Nga Sơn",
  phone: "",
  zaloUrl: "",
  facebookUrl: "",
  address: "Quang Thành - Kinh Môn - Hải Dương",
  workingHours: "",
};

const businessFocus = [
  "Điều hòa",
  "Tivi",
  "Tủ lạnh",
  "Máy giặt",
  "Dịch vụ sửa chữa",
  "Dịch vụ bảo dưỡng",
  "Dịch vụ lắp đặt",
] as const;

const providedItems = [
  {
    title: "Tư vấn điều hòa",
    description:
      "Chọn đúng công suất theo diện tích phòng và ngân sách.",
  },
  {
    title: "Thiết bị điện máy gia đình",
    description:
      "Tivi, tủ lạnh, máy giặt cho gia đình.",
  },
  {
    title: "Sửa chữa điện lạnh",
    description:
      "Sửa điều hòa, tủ lạnh, máy giặt.",
  },
  {
    title: "Bảo dưỡng và lắp đặt",
    description:
      "Vệ sinh, bảo dưỡng và lắp đặt điều hòa.",
  },
] as const;

const chooseReasons = [
  "Cửa hàng địa phương, dễ liên hệ.",
  "Tư vấn trực tiếp, đúng nhu cầu.",
  "Chuyên điều hòa và điện lạnh.",
  "Gọi, Zalo, Facebook hoặc form báo giá.",
] as const;

const commitments = [
  "Tư vấn rõ ràng theo nhu cầu từng gia đình.",
  "Báo giá trước, khách quyết định sau.",
  "Hỗ trợ trực tiếp qua điện thoại và Zalo.",
  "Ưu tiên phục vụ nhanh tại Kinh Môn.",
] as const;

function getDisplayValue(value: string, fallback: string): string {
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

function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

function buildLocalBusinessSchema(storeInfo: StoreInfo) {
  const baseUrl = getBaseUrl();
  const sameAs = [storeInfo.zaloUrl, storeInfo.facebookUrl].filter((url) =>
    isHttpUrl(url),
  );

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: getDisplayValue(storeInfo.storeName, fallbackStoreInfo.storeName),
    url: `${baseUrl}/about`,
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
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    areaServed: ["Quang Thành", "Kinh Môn", "Hải Dương"],
    makesOffer: businessFocus.map((item) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: item,
      },
    })),
  };
}

async function getSafeStoreInfo(): Promise<StoreInfo> {
  try {
    return await getStoreInfo();
  } catch {
    return fallbackStoreInfo;
  }
}

export default async function AboutPage() {
  const storeInfo = await getSafeStoreInfo();
  const storeName = getDisplayValue(
    storeInfo.storeName,
    fallbackStoreInfo.storeName,
  );
  const address = getDisplayValue(storeInfo.address, fallbackStoreInfo.address);
  const phoneHref = getPhoneHref(storeInfo.phone);
  const zaloHref = getUrlHref(storeInfo.zaloUrl);
  const localBusinessSchema = buildLocalBusinessSchema(storeInfo);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(localBusinessSchema),
        }}
      />

      <Section padding="none" className="bg-[#F8FAFC] py-10 sm:py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-sm font-bold uppercase text-[#0369A1]">
                Giới thiệu cửa hàng
              </p>
              <h1 className="text-3xl font-bold leading-tight text-[#111827] sm:text-5xl">
                {storeName}
              </h1>
              <p className="text-base leading-7 text-[#6B7280]">
                {storeName} là cửa hàng điện máy địa phương tại {address}, tập
                trung tư vấn sản phẩm gia dụng và dịch vụ điện lạnh cho khách
                hàng tại Quang Thành, Kinh Môn, Hải Dương.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={phoneHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#C2410C] px-5 text-sm font-bold text-white hover:bg-[#9A3412]"
                >
                  Gọi ngay
                </a>
                <a
                  href={zaloHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] bg-white px-5 text-sm font-bold text-[#0369A1] hover:bg-[#E0F2FE]"
                >
                  Nhắn Zalo
                </a>
                <Link
                  href="/contact#bao-gia"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-5 text-sm font-bold text-[#111827] hover:bg-white"
                >
                  Gửi yêu cầu báo giá
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)] sm:p-6">
              <h2 className="text-xl font-bold text-[#111827]">
                Trọng tâm kinh doanh
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {businessFocus.map((item) => (
                  <div
                    key={item}
                    className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#111827]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">
              Câu chuyện của chúng tôi
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#6B7280]">
              {storeName} được xây dựng như một điểm liên hệ điện máy gần gũi
              cho khách hàng gia đình tại Kinh Môn.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#6B7280]">
              Với vị trí tại Quang Thành - Kinh Môn - Hải Dương, cửa hàng ưu
              tiên các nhu cầu phổ biến như mua điều hòa, lắp đặt điều hòa, bảo
              dưỡng điều hòa, sửa tủ lạnh và sửa máy giặt.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#111827]">
              Chúng tôi cung cấp gì?
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {providedItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-lg border border-[#E5E7EB] bg-white p-5"
                >
                  <h3 className="text-lg font-bold text-[#111827]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-[#F8FAFC]">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Vì sao khách hàng chọn chúng tôi?
              </h2>
              <div className="mt-5 grid gap-3">
                {chooseReasons.map((reason) => (
                  <div
                    key={reason}
                    className="rounded-lg border border-[#E5E7EB] bg-white p-4 text-sm leading-6 text-[#374151]"
                  >
                    {reason}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Khu vực phục vụ
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                Kinh Môn, Quang Thành và các khu vực lân cận tại Hải Dương.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Quang Thành", "Kinh Môn", "Hải Dương"].map((area) => (
                  <div
                    key={area}
                    className="rounded-lg border border-[#BAE6FD] bg-white p-4 text-center text-sm font-bold text-[#0369A1]"
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Cam kết của chúng tôi
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {commitments.map((commitment) => (
                  <div
                    key={commitment}
                    className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#374151]"
                  >
                    {commitment}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#FED7AA] bg-[#FFF7ED] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#111827]">
                Cần tư vấn sản phẩm hoặc dịch vụ?
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#374151]">
                Gọi hoặc nhắn Zalo cho {storeName} để được tư vấn nhanh.
              </p>
              <div className="mt-5 grid gap-3">
                <a
                  href={phoneHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#C2410C] px-5 text-sm font-bold text-white hover:bg-[#9A3412]"
                >
                  Gọi ngay
                </a>
                <a
                  href={zaloHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] bg-white px-5 text-sm font-bold text-[#0369A1] hover:bg-[#E0F2FE]"
                >
                  Nhắn Zalo
                </a>
                <Link
                  href="/contact#bao-gia"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#C2410C] bg-white px-5 text-sm font-bold text-[#C2410C] hover:bg-white"
                >
                  Gửi yêu cầu báo giá
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
