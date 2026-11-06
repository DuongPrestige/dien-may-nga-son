import { LeadSourceType } from "@prisma/client";
import { Ruler, ShieldCheck, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { LeadForm } from "@/src/features/leads/components/lead-form";
import { ProductCard } from "@/src/features/products/components/product-card";
import { ProductImage } from "@/src/features/products/components/product-image";
import { ProductPrice } from "@/src/features/products/components/product-price";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
} from "@/src/features/products/services/products.service";
import type {
  ProductCardData,
  ProductDetailData,
} from "@/src/features/products/types/products.types";
import { toSafePriceNumber } from "@/src/features/products/utils/price";
import { AIR_CONDITIONER_CATEGORY_SLUG } from "@/src/features/products/lib/product-highlights";
import { PolicyList } from "@/src/features/settings/components/policy-list";
import {
  getStoreContactLinks,
  getTrustContent,
} from "@/src/features/settings/services/settings.service";
import {
  BreadcrumbSchema,
  FAQSchema,
  ProductSchema,
  serializeJsonLd,
} from "@/src/lib/schema";
import { buildMetadata } from "@/src/lib/seo";
import { getSafeImageSrc } from "@/src/lib/image-src";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 300;

const priceNote = "Gọi để nhận báo giá kèm lắp đặt.";

const purchaseSupport = [
  { icon: Ruler, label: "Tư vấn đúng công suất" },
  { icon: Wrench, label: "Tư vấn vị trí, vật tư lắp đặt" },
  { icon: ShieldCheck, label: "Báo rõ bảo hành trước khi mua" },
] as const;

const faqs = [
  {
    question: "Giá sản phẩm trên website đã chính xác chưa?",
    answer:
      "Giá hiển thị là thông tin tham khảo. Khách hàng nên liên hệ Điện Máy Nga Sơn để nhận báo giá chính xác và ưu đãi hiện tại.",
  },
  {
    question: "Điện Máy Nga Sơn có hỗ trợ lắp đặt điều hòa không?",
    answer:
      "Có. Cửa hàng hỗ trợ tư vấn vị trí lắp đặt, vật tư phù hợp và bàn giao rõ ràng cho khách hàng địa phương.",
  },
  {
    question: "Tôi có thể nhận tư vấn qua điện thoại hoặc Zalo không?",
    answer:
      "Có. Khách hàng có thể gọi trực tiếp, nhắn Zalo hoặc gửi form báo giá để được liên hệ lại.",
  },
] as const;

async function getSafeProduct(
  slug: string,
): Promise<ProductDetailData | null> {
  try {
    return await getProductBySlug(slug);
  } catch {
    return null;
  }
}

async function getSafeRelatedProducts(
  product: ProductDetailData,
): Promise<ProductCardData[]> {
  try {
    return await getRelatedProducts(product.id, product.category.slug);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getProductSlugs();

    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getSafeProduct(slug);

  if (!product) {
    return {
      title: "Sản phẩm | Điện Máy Nga Sơn",
    };
  }

  const title =
    product.seoTitle ?? `${product.name} | Giá tốt tại Điện Máy Nga Sơn`;
  const description =
    product.seoDescription ??
    product.shortDescription ??
    `Xem thông tin ${product.name}, giá tham khảo, thông số và gửi yêu cầu báo giá tại Điện Máy Nga Sơn.`;
  const thumbnailSrc = getSafeImageSrc(product.thumbnailUrl);

  return buildMetadata({
    title,
    description,
    path: `/products/${product.slug}`,
    images: thumbnailSrc ? [thumbnailSrc] : undefined,
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const [product, contactLinks, trustContent] = await Promise.all([
    getSafeProduct(slug),
    getStoreContactLinks(),
    getTrustContent(),
  ]);

  if (!product) {
    notFound();
  }

  const galleryImages = [
    product.thumbnailUrl,
    ...product.images.map((image) => image.imageUrl),
  ]
    .map(getSafeImageSrc)
    .filter((image): image is string => image !== null);
  const relatedProducts = await getSafeRelatedProducts(product);
  const isAirConditioner =
    product.category.slug === AIR_CONDITIONER_CATEGORY_SLUG;
  const productSchemaPrice =
    toSafePriceNumber(product.salePrice) ??
    toSafePriceNumber(product.price) ??
    undefined;
  const productSchema = ProductSchema({
    name: product.name,
    description: product.shortDescription ?? product.description ?? product.name,
    image: galleryImages.length > 0 ? galleryImages : undefined,
    brandName: product.brand.name,
    category: product.category.name,
    price: productSchemaPrice,
    url: `/products/${product.slug}`,
  });
  const faqSchema = FAQSchema([...faqs]);
  const breadcrumbSchema = BreadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Sản phẩm", url: "/products" },
    { name: product.name, url: `/products/${product.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />

      <Section padding="none" className="bg-[#F8FAFC] py-8 sm:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-3">
              <ProductImage
                src={galleryImages[0]}
                alt={product.name}
                priority
              />
              {galleryImages.length > 1 ? (
                <div className="grid grid-cols-3 gap-3">
                  {galleryImages.slice(1, 4).map((image) => (
                    <ProductImage
                      key={image}
                      src={image}
                      alt={`${product.name} hình ảnh`}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6">
              <p className="text-sm font-semibold text-[#0369A1]">
                {product.brand.name} · {product.category.name}
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-[#111827] sm:text-4xl">
                {product.name}
              </h1>
              {product.shortDescription ? (
                <p className="mt-3 text-base leading-7 text-[#6B7280]">
                  {product.shortDescription}
                </p>
              ) : null}
              <div className="mt-5">
                <ProductPrice
                  price={product.price}
                  salePrice={product.salePrice}
                />
                <p className="mt-2 text-sm font-semibold text-[#374151]">
                  {priceNote}
                </p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <a
                  href={contactLinks.phoneHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md cta-orange px-4 text-sm font-bold text-white"
                >
                  Gọi ngay
                </a>
                <a
                  href={contactLinks.zaloHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-4 text-sm font-bold text-[#0369A1] hover:bg-[#E0F2FE]"
                >
                  Nhắn Zalo
                </a>
                <a
                  href="#bao-gia"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#E5E7EB] px-4 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
                >
                  Báo giá
                </a>
              </div>
              {product.specs.length > 0 ? (
                <div className="mt-6">
                  <h2 className="text-lg font-bold text-[#111827]">
                    Thông số nhanh
                  </h2>
                  <dl className="mt-3 grid gap-2 text-sm">
                    {product.specs.map((spec) => (
                      <div
                        key={spec.specName}
                        className="grid grid-cols-[0.45fr_0.55fr] gap-3 rounded-md bg-[#F8FAFC] p-3"
                      >
                        <dt className="font-semibold text-[#111827]">
                          {spec.specName}
                        </dt>
                        <dd className="text-[#6B7280]">{spec.specValue}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                Mô tả sản phẩm
              </h2>
              <div className="mt-3 whitespace-pre-line text-sm leading-7 text-[#6B7280]">
                {product.description ??
                  "Thông tin mô tả chi tiết đang được cập nhật. Quý khách vui lòng liên hệ Điện Máy Nga Sơn để được tư vấn nhanh và chính xác."}
              </div>
            </div>

            <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                Hỗ trợ khi mua
              </h2>
              <ul className="mt-3 grid gap-2 text-sm font-medium text-[#374151] sm:grid-cols-3">
                {purchaseSupport.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[#0369A1]"
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {isAirConditioner ? (
              <PolicyList
                title="Gói lắp đặt điều hòa"
                lines={trustContent.acInstallLines}
              />
            ) : null}

            <PolicyList
              title="Chính sách bảo hành"
              lines={trustContent.warrantyLines}
            />

            <div>
              <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                Câu hỏi thường gặp
              </h2>
              <div className="mt-4 space-y-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="rounded-lg border border-[#E5E7EB] bg-white p-4"
                  >
                    <summary className="cursor-pointer text-sm font-bold text-[#111827]">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-[#6B7280]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside
            id="bao-gia"
            className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)]"
          >
            <h2 className="text-xl font-bold text-[#111827]">
              Gửi yêu cầu báo giá
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Cửa hàng sẽ gọi lại báo giá.
            </p>
            <LeadForm
              className="mt-5"
              sourceType={LeadSourceType.PRODUCT}
              sourceUrl={`/products/${product.slug}`}
              productId={product.id}
            />
          </aside>
        </Container>
      </Section>

      {relatedProducts.length > 0 ? (
        <Section className="bg-[#F8FAFC]">
          <Container>
            <h2 className="text-2xl font-bold text-[#111827]">
              Sản phẩm liên quan
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  contactLinks={contactLinks}
                  headingLevel="h3"
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
