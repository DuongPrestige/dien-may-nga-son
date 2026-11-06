export const UPLOAD_FOLDERS = {
  products: "dien-may-nga-son/products",
  services: "dien-may-nga-son/services",
  blog: "dien-may-nga-son/blog",
  projects: "dien-may-nga-son/projects",
  banners: "dien-may-nga-son/banners",
  settings: "dien-may-nga-son/settings",
} as const;

export type UploadFolder = keyof typeof UPLOAD_FOLDERS;

export type UploadImageResult =
  | {
      success: true;
      url: string;
    }
  | {
      success: false;
      message: string;
    };
