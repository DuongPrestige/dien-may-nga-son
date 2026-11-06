import "server-only";

import { Prisma, ProjectStatus, ProjectType } from "@prisma/client";

import {
  FacebookImportError,
  fetchFacebookPageHtml,
} from "@/src/features/projects/lib/facebook-fetch";
import {
  buildFacebookProjectDraftContent,
  canonicalizeFacebookUrl,
  extractFacebookMetadata,
  isUsableFacebookMetadata,
} from "@/src/features/projects/lib/facebook-metadata";
import {
  createProject,
  generateUniqueProjectSlug,
} from "@/src/features/projects/services/projects.service";
import { projectFormSchema } from "@/src/features/projects/validators/project.validator";
import { UPLOAD_FOLDERS } from "@/src/features/uploads/types/upload.types";
import { uploadRemoteImageToCloudinary } from "@/src/lib/cloudinary-remote-upload";

const DEFAULT_IMPORT_LOCATION = "Kinh Môn";
const SLUG_CREATE_ATTEMPTS = 2;

export type FacebookImportResult = {
  id: string;
  slug: string;
  hasImage: boolean;
};

async function rehostImage(imageUrl: string | null): Promise<string | null> {
  if (!imageUrl) {
    return null;
  }

  try {
    return await uploadRemoteImageToCloudinary(
      imageUrl,
      UPLOAD_FOLDERS.projects,
    );
  } catch (error) {
    console.error("Failed to re-upload Facebook image to Cloudinary", error);
    return null;
  }
}

function isUniqueSlugError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

/**
 * Reads a public Facebook post's OpenGraph metadata and stores it as a DRAFT
 * project for the admin to review. Throws FacebookImportError with a
 * user-facing message when the post cannot be read.
 */
export async function importFacebookPostAsDraft(
  inputUrl: string,
): Promise<FacebookImportResult> {
  const facebookUrl = canonicalizeFacebookUrl(inputUrl);
  const page = await fetchFacebookPageHtml(facebookUrl);
  const metadata = extractFacebookMetadata(page.html);

  if (!isUsableFacebookMetadata(metadata)) {
    throw new FacebookImportError("unreadable");
  }

  const draftContent = buildFacebookProjectDraftContent(metadata);
  const thumbnailUrl = await rehostImage(metadata.imageUrl);

  for (let attempt = 1; ; attempt += 1) {
    const slug = await generateUniqueProjectSlug(draftContent.title);
    const draft = projectFormSchema.parse({
      ...draftContent,
      slug,
      status: ProjectStatus.DRAFT,
      projectType: ProjectType.OTHER,
      location: DEFAULT_IMPORT_LOCATION,
      performedAt: new Date(),
      thumbnailUrl: thumbnailUrl ?? "",
      facebookUrl,
    });

    try {
      const project = await createProject(draft);
      return { ...project, hasImage: Boolean(thumbnailUrl) };
    } catch (error) {
      if (!isUniqueSlugError(error) || attempt >= SLUG_CREATE_ATTEMPTS) {
        throw error;
      }
    }
  }
}
