import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const settings = [
  ["store_name", "Điện Máy Nga Sơn"],
  ["address", "Quang Thành - Kinh Môn - Hải Dương"],
  ["phone", ""],
  ["zalo_url", ""],
  ["facebook_url", ""],
  ["working_hours", ""],
  ["google_map_embed", ""],
] as const;

const categories = [
  { name: "Điều hòa", slug: "dieu-hoa" },
  { name: "Tivi", slug: "tivi" },
  { name: "Tủ lạnh", slug: "tu-lanh" },
  { name: "Máy giặt", slug: "may-giat" },
] as const;

const brands = [
  { name: "Daikin", slug: "daikin" },
  { name: "Panasonic", slug: "panasonic" },
  { name: "Casper", slug: "casper" },
  { name: "LG", slug: "lg" },
  { name: "Samsung", slug: "samsung" },
  { name: "Aqua", slug: "aqua" },
  { name: "Toshiba", slug: "toshiba" },
  { name: "Funiki", slug: "funiki" },
] as const;

const services = [
  { name: "Sửa điều hòa Kinh Môn", slug: "sua-dieu-hoa-kinh-mon" },
  {
    name: "Bảo dưỡng điều hòa Kinh Môn",
    slug: "bao-duong-dieu-hoa-kinh-mon",
  },
  { name: "Lắp đặt điều hòa Kinh Môn", slug: "lap-dat-dieu-hoa-kinh-mon" },
  { name: "Sửa tủ lạnh Kinh Môn", slug: "sua-tu-lanh-kinh-mon" },
  { name: "Sửa máy giặt Kinh Môn", slug: "sua-may-giat-kinh-mon" },
] as const;

const postCategories = [
  { name: "Tư vấn mua điều hòa", slug: "tu-van-mua-dieu-hoa" },
  {
    name: "Kinh nghiệm sử dụng điều hòa",
    slug: "kinh-nghiem-su-dung-dieu-hoa",
  },
  { name: "Lỗi thường gặp", slug: "loi-thuong-gap" },
  { name: "Bảo dưỡng điện máy", slug: "bao-duong-dien-may" },
  { name: "Sửa chữa điện lạnh", slug: "sua-chua-dien-lanh" },
  { name: "Tiết kiệm điện", slug: "tiet-kiem-dien" },
] as const;

async function seedSettings() {
  for (const [settingKey, settingValue] of settings) {
    await prisma.setting.upsert({
      where: { settingKey },
      update: { settingValue },
      create: { settingKey, settingValue },
    });
  }
}

async function seedCategories() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
}

async function seedBrands() {
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name },
      create: brand,
    });
  }
}

async function seedServices() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { name: service.name },
      create: service,
    });
  }
}

async function seedPostCategories() {
  for (const category of postCategories) {
    await prisma.postCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
}

async function main() {
  await seedSettings();
  await seedCategories();
  await seedBrands();
  await seedServices();
  await seedPostCategories();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
