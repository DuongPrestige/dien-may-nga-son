import {
  toSafePriceNumber,
  type PriceValue,
} from "@/src/features/products/utils/price";

export type AirConditionerCapacity = {
  btu: number;
  horsepower: string;
  roomSize: string;
};

/**
 * Common sizing guide used by Vietnamese appliance retailers
 * (BTU ↔ HP ↔ recommended room area).
 */
export const AIR_CONDITIONER_CAPACITIES: readonly AirConditionerCapacity[] = [
  { btu: 9000, horsepower: "1 HP", roomSize: "Dưới 15m²" },
  { btu: 12000, horsepower: "1.5 HP", roomSize: "15–20m²" },
  { btu: 18000, horsepower: "2 HP", roomSize: "20–30m²" },
  { btu: 24000, horsepower: "2.5 HP", roomSize: "30–40m²" },
];

export const AIR_CONDITIONER_CATEGORY_SLUG = "dieu-hoa";

export const CAPACITY_SPEC_NAME = "Công suất";
const ROOM_SIZE_SPEC_NAME = "Diện tích phù hợp";
const TECHNOLOGY_SPEC_NAME = "Công nghệ";

/** Spec names worth showing as chips on a product card, in priority order. */
const CARD_HIGHLIGHT_SPEC_NAMES = [
  CAPACITY_SPEC_NAME,
  ROOM_SIZE_SPEC_NAME,
  "Kích thước màn hình",
  "Độ phân giải",
  "Dung tích sử dụng",
  "Khối lượng giặt",
  "Kiểu máy",
  TECHNOLOGY_SPEC_NAME,
] as const;

export const CARD_SPEC_NAMES: readonly string[] = CARD_HIGHLIGHT_SPEC_NAMES;

const MAX_CARD_HIGHLIGHTS = 3;
const BTU_IN_TEXT_PATTERN = /(\d{1,2})[.,]?(\d{3})\s?BTU/i;

type SpecLike = {
  specName: string;
  specValue: string;
};

export function findCapacityOption(
  btu: number | undefined,
): AirConditionerCapacity | undefined {
  return AIR_CONDITIONER_CAPACITIES.find((option) => option.btu === btu);
}

export function parseBtuFromText(text: string): number | undefined {
  const match = BTU_IN_TEXT_PATTERN.exec(text);

  if (!match) {
    return undefined;
  }

  const btu = Number(`${match[1]}${match[2]}`);

  return Number.isFinite(btu) ? btu : undefined;
}

function formatBtu(btu: number): string {
  return `${btu.toLocaleString("vi-VN")} BTU`;
}

/**
 * Builds up to three short, decision-relevant chips for a product card.
 * Air conditioner capacity / room size fall back to values parsed from the
 * product name, because many listings put "12000BTU" in the name only.
 */
export function getProductHighlights(product: {
  name: string;
  specs: readonly SpecLike[];
}): string[] {
  const specByName = new Map(
    product.specs.map((spec) => [spec.specName, spec.specValue.trim()]),
  );
  const btu =
    parseBtuFromText(specByName.get(CAPACITY_SPEC_NAME) ?? "") ??
    parseBtuFromText(product.name);
  const capacityOption = findCapacityOption(btu);
  const highlights: string[] = [];

  if (btu) {
    highlights.push(
      capacityOption
        ? `${formatBtu(btu)} · ${capacityOption.horsepower}`
        : formatBtu(btu),
    );
  }

  const roomSize =
    specByName.get(ROOM_SIZE_SPEC_NAME) ??
    (capacityOption ? capacityOption.roomSize : undefined);

  if (roomSize) {
    const normalizedRoomSize = roomSize.replace(/\s+m²/, "m²");
    highlights.push(
      `Phòng ${normalizedRoomSize.charAt(0).toLowerCase()}${normalizedRoomSize.slice(1)}`,
    );
  }

  for (const specName of CARD_HIGHLIGHT_SPEC_NAMES) {
    if (highlights.length >= MAX_CARD_HIGHLIGHTS) {
      break;
    }

    if (specName === CAPACITY_SPEC_NAME || specName === ROOM_SIZE_SPEC_NAME) {
      continue;
    }

    const value = specByName.get(specName);

    if (value && !highlights.includes(value)) {
      highlights.push(value);
    }
  }

  return highlights.slice(0, MAX_CARD_HIGHLIGHTS);
}

export function getDiscountPercent(
  price: PriceValue,
  salePrice: PriceValue,
): number | null {
  const normalPrice = toSafePriceNumber(price);
  const discountedPrice = toSafePriceNumber(salePrice);

  if (
    normalPrice === null ||
    discountedPrice === null ||
    normalPrice <= 0 ||
    discountedPrice >= normalPrice
  ) {
    return null;
  }

  const percent = Math.round(((normalPrice - discountedPrice) / normalPrice) * 100);

  return percent > 0 ? percent : null;
}
