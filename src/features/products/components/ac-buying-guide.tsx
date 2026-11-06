import { Gauge, Sun, Zap } from "lucide-react";
import Link from "next/link";

import {
  AIR_CONDITIONER_CAPACITIES,
  AIR_CONDITIONER_CATEGORY_SLUG,
} from "@/src/features/products/lib/product-highlights";

const TIPS = [
  {
    icon: Zap,
    title: "Inverter hay thường?",
    detail: "Dùng trên 4 giờ/ngày nên chọn Inverter để tiết kiệm điện. Dùng ít, máy thường rẻ hơn.",
  },
  {
    icon: Sun,
    title: "Phòng nắng, tầng mái",
    detail: "Phòng hướng Tây, tầng trên cùng hoặc trần cao nên chọn tăng 1 cấp công suất.",
  },
  {
    icon: Gauge,
    title: "Đông người, nhiều thiết bị",
    detail: "Phòng khách, phòng có bếp hoặc nhiều máy tính cũng nên tăng 1 cấp.",
  },
] as const;

/** Short, general sizing guidance shown under the air-conditioner listing. */
export function AcBuyingGuide() {
  return (
    <section
      aria-labelledby="huong-dan-chon-dieu-hoa"
      className="rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-6"
    >
      <h2
        id="huong-dan-chon-dieu-hoa"
        className="text-xl font-bold text-[#111827] sm:text-2xl"
      >
        Chọn điều hòa bao nhiêu BTU?
      </h2>

      <div className="mt-4 overflow-hidden rounded-lg border border-[#E5E7EB]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F0F9FF] text-[#0C4A6E]">
            <tr>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Diện tích phòng
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Công suất
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">
                <span className="sr-only">Xem mẫu</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {AIR_CONDITIONER_CAPACITIES.map((option) => (
              <tr key={option.btu}>
                <td className="px-3 py-2.5 font-medium text-[#111827]">
                  {option.roomSize}
                </td>
                <td className="px-3 py-2.5 text-[#374151]">
                  {option.btu.toLocaleString("vi-VN")} BTU · {option.horsepower}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Link
                    href={`/products?category=${AIR_CONDITIONER_CATEGORY_SLUG}&capacity=${option.btu}#danh-sach`}
                    className="inline-flex min-h-9 items-center whitespace-nowrap font-semibold text-[#0369A1] hover:text-[#075985]"
                  >
                    Xem mẫu →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 grid gap-3 md:grid-cols-3">
        {TIPS.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex gap-3 rounded-lg bg-[#F8FAFC] p-3">
            <Icon
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-[#0369A1]"
            />
            <div>
              <p className="text-sm font-bold text-[#111827]">{title}</p>
              <p className="mt-0.5 text-sm leading-6 text-[#4B5563]">{detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
