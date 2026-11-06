export const MAX_PRICE_ITEMS = 12;
export const PRICE_TABLE_SEPARATOR = "|";

export type PriceItemInput = {
  name: string;
  priceLabel: string;
  note?: string;
};

export type PriceTableParseResult =
  | { success: true; items: PriceItemInput[] }
  | { success: false; error: string };

const LIMITS = { name: 255, priceLabel: 100, note: 255 } as const;

/**
 * Parses the admin textarea format, one item per line:
 * "Vệ sinh điều hòa treo tường | 150.000đ | Mỗi máy"
 */
export function parsePriceTable(raw: string): PriceTableParseResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > MAX_PRICE_ITEMS) {
    return {
      success: false,
      error: `Tối đa ${MAX_PRICE_ITEMS} dòng bảng giá`,
    };
  }

  const items: PriceItemInput[] = [];

  for (const [index, line] of lines.entries()) {
    const [name = "", priceLabel = "", ...noteParts] = line
      .split(PRICE_TABLE_SEPARATOR)
      .map((part) => part.trim());
    const note = noteParts.join(` ${PRICE_TABLE_SEPARATOR} `).trim();

    if (!name || !priceLabel) {
      return {
        success: false,
        error: `Dòng ${index + 1} cần dạng: Hạng mục | Giá | Ghi chú (tùy chọn)`,
      };
    }

    if (
      name.length > LIMITS.name ||
      priceLabel.length > LIMITS.priceLabel ||
      note.length > LIMITS.note
    ) {
      return {
        success: false,
        error: `Dòng ${index + 1} quá dài`,
      };
    }

    items.push(note ? { name, priceLabel, note } : { name, priceLabel });
  }

  return { success: true, items };
}

export function formatPriceTable(
  items: ReadonlyArray<{ name: string; priceLabel: string; note: string | null }>,
): string {
  return items
    .map((item) =>
      [item.name, item.priceLabel, item.note ?? ""]
        .filter((part, index) => index < 2 || part)
        .join(` ${PRICE_TABLE_SEPARATOR} `),
    )
    .join("\n");
}
