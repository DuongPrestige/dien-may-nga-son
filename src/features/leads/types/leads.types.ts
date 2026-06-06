import type { Lead, LeadSourceType, LeadStatus } from "@prisma/client";

export type CreateLeadInput = {
  name: string;
  phone: string;
  message?: string;
  sourceType: LeadSourceType;
  sourceUrl?: string;
  productId?: string;
  serviceId?: string;
};

export type GetLeadsInput = {
  status?: LeadStatus;
  sourceType?: LeadSourceType;
  page?: number;
  limit?: number;
};

export type AdminLeadFilters = {
  search?: string;
  status?: LeadStatus;
  page?: number;
  limit?: number;
};

export type UpdateLeadStatusInput = {
  id: string;
  status: LeadStatus;
};

export type LeadListItem = Pick<
  Lead,
  | "id"
  | "name"
  | "phone"
  | "message"
  | "sourceType"
  | "sourceUrl"
  | "status"
  | "createdAt"
>;

export type FieldErrors = Partial<Record<keyof CreateLeadInput, string>>;

export type LeadFormState = {
  success: boolean;
  message: string;
  fieldErrors: FieldErrors;
};

export type LeadStatusActionState = {
  success: boolean;
  message: string;
  fieldErrors: {
    status?: string;
  };
};

export type ActionResult<TData = undefined> =
  | {
      success: true;
      message?: string;
      data: TData;
    }
  | {
      success: false;
      message: string;
    };

