import { ProjectType } from "@prisma/client";

export const PROJECT_TYPE_OPTIONS = [
  { value: ProjectType.AIRCON_INSTALL, label: "Lắp đặt điều hòa" },
  { value: ProjectType.AIRCON_MAINTENANCE, label: "Bảo dưỡng điều hòa" },
  { value: ProjectType.AIRCON_REPAIR, label: "Sửa điều hòa" },
  { value: ProjectType.WASHING_MACHINE_REPAIR, label: "Sửa máy giặt" },
  { value: ProjectType.REFRIGERATOR_REPAIR, label: "Sửa tủ lạnh" },
  { value: ProjectType.TV_INSTALL, label: "Lắp đặt tivi" },
  { value: ProjectType.DELIVERY, label: "Giao hàng" },
  { value: ProjectType.OTHER, label: "Công trình khác" },
] as const;

export function getProjectTypeLabel(projectType: ProjectType): string {
  return (
    PROJECT_TYPE_OPTIONS.find((option) => option.value === projectType)
      ?.label ?? "Công trình thực tế"
  );
}
