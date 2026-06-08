import type { SeoRedirect } from "@prisma/client";

export type AdminRedirectListItem = Pick<
  SeoRedirect,
  "id" | "sourcePath" | "destinationPath" | "createdAt"
>;

export type RedirectActionState = {
  success: boolean;
  message: string;
  fieldErrors: {
    sourcePath?: string;
    targetPath?: string;
  };
};

export type DeleteRedirectResult = {
  success: boolean;
  message: string;
};
