export const BANNER_POSITIONS = [
  { value: "home", label: "Trang chủ (dưới phần giới thiệu)" },
  { value: "products", label: "Trang sản phẩm (đầu danh sách)" },
] as const;

export type BannerPosition = (typeof BANNER_POSITIONS)[number]["value"];

export const BANNER_POSITION_VALUES = BANNER_POSITIONS.map(
  (position) => position.value,
) as [BannerPosition, ...BannerPosition[]];

export const BANNERS_CACHE_TAG = "banners";

export const MAX_BANNERS_PER_POSITION = 4;

export function getBannerPositionLabel(position: string | null): string {
  return (
    BANNER_POSITIONS.find((item) => item.value === position)?.label ??
    "Chưa chọn vị trí"
  );
}
