import { Container } from "@/src/components/shared/container";
import type { TrustStat } from "@/src/features/settings/services/settings.service";

type HomeTrustStatsProps = {
  stats: TrustStat[];
};

const GRID_COLUMNS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

/** Real numbers entered by the owner in Settings; hidden until at least one is set. */
export function HomeTrustStats({ stats }: HomeTrustStatsProps) {
  if (stats.length === 0) {
    return null;
  }

  return (
    <section aria-label="Số liệu cửa hàng" className="border-y border-[#E5E7EB] bg-white">
      <Container
        className={`grid divide-x divide-[#E5E7EB] py-4 sm:py-6 ${GRID_COLUMNS[stats.length] ?? "grid-cols-3"}`}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="px-2 text-center">
            <p className="text-xl font-extrabold text-[#0369A1] sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs font-medium text-[#4B5563] sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </Container>
    </section>
  );
}
