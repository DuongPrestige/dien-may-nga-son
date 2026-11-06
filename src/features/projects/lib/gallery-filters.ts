import { ProjectType } from "@prisma/client";

export type GalleryFilter = {
  value: string;
  label: string;
  projectTypes: readonly ProjectType[];
};

/** `?loai=` filter chips for /hinh-anh-thuc-te, per the Phase 2 roadmap. */
export const GALLERY_FILTERS: readonly GalleryFilter[] = [
  {
    value: "dieu-hoa",
    label: "Điều hòa",
    projectTypes: [
      ProjectType.AIRCON_INSTALL,
      ProjectType.AIRCON_MAINTENANCE,
      ProjectType.AIRCON_REPAIR,
    ],
  },
  {
    value: "may-giat",
    label: "Máy giặt",
    projectTypes: [ProjectType.WASHING_MACHINE_REPAIR],
  },
  {
    value: "tivi",
    label: "Tivi",
    projectTypes: [ProjectType.TV_INSTALL],
  },
  {
    value: "tu-lanh",
    label: "Tủ lạnh",
    projectTypes: [ProjectType.REFRIGERATOR_REPAIR],
  },
  {
    value: "giao-hang",
    label: "Giao hàng",
    projectTypes: [ProjectType.DELIVERY],
  },
  {
    value: "lap-dat",
    label: "Lắp đặt",
    projectTypes: [ProjectType.AIRCON_INSTALL, ProjectType.TV_INSTALL],
  },
];

export function getGalleryFilter(
  value: string | undefined,
): GalleryFilter | undefined {
  return GALLERY_FILTERS.find((filter) => filter.value === value);
}
