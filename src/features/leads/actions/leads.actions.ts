"use server";

import type { LeadStatus } from "@prisma/client";

import {
  createLead,
  updateLeadStatus,
} from "@/src/features/leads/services/leads.service";
import type {
  ActionResult,
  LeadFormState,
} from "@/src/features/leads/types/leads.types";
import {
  createLeadSchema,
  updateLeadStatusSchema,
} from "@/src/features/leads/validators/lead.validator";

const leadSuccessMessage =
  "Cảm ơn bạn. Điện Máy Nga Sơn sẽ liên hệ với bạn trong thời gian sớm nhất.";

function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function createLeadAction(
  _previousState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const parsedInput = createLeadSchema.safeParse({
    name: getStringValue(formData, "name"),
    phone: getStringValue(formData, "phone"),
    message: getStringValue(formData, "message"),
    sourceType: getStringValue(formData, "sourceType"),
    sourceUrl: getStringValue(formData, "sourceUrl"),
    productId: getStringValue(formData, "productId"),
    serviceId: getStringValue(formData, "serviceId"),
  });

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin",
      fieldErrors: parsedInput.error.issues.reduce<LeadFormState["fieldErrors"]>(
        (errors, issue) => {
          const field = issue.path[0];

          if (typeof field === "string") {
            return {
              ...errors,
              [field]: issue.message,
            };
          }

          return errors;
        },
        {},
      ),
    };
  }

  try {
    await createLead(parsedInput.data);

    return {
      success: true,
      message: leadSuccessMessage,
      fieldErrors: {},
    };
  } catch (error) {
    console.error("Failed to create lead", error);

    return {
      success: false,
      message: "Không thể gửi yêu cầu. Vui lòng thử lại sau.",
      fieldErrors: {},
    };
  }
}

export async function updateLeadStatusAction(input: {
  id: string;
  status: LeadStatus;
}): Promise<ActionResult> {
  const parsedInput = updateLeadStatusSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      message:
        parsedInput.error.issues[0]?.message ??
        "Trạng thái khách hàng tiềm năng không hợp lệ",
    };
  }

  try {
    await updateLeadStatus(parsedInput.data);

    return {
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: undefined,
    };
  } catch (error) {
    console.error("Failed to update lead status", error);

    return {
      success: false,
      message: "Không thể cập nhật trạng thái",
    };
  }
}

