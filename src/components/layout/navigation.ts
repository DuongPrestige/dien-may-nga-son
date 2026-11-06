export const MAIN_NAVIGATION_ITEMS = [
  { href: "/products", label: "Sản phẩm" },
  { href: "/services", label: "Dịch vụ" },
  { href: "/cong-trinh-thuc-te", label: "Công trình" },
  { href: "/blog", label: "Kinh nghiệm" },
  { href: "/contact", label: "Liên hệ" },
] as const;

export type NavigationItem = (typeof MAIN_NAVIGATION_ITEMS)[number];
