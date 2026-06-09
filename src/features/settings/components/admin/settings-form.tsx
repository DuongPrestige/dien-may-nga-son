"use client";

import { useActionState } from "react";

import { updateSettingsAction } from "@/src/features/settings/actions/settings.actions";
import type {
  SettingsActionState,
  SettingsMap,
} from "@/src/features/settings/types/settings.types";

const initialState: SettingsActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

type SettingsFormProps = {
  settings: SettingsMap;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <SettingsSection
        title="General Information"
        description="Store identity and customer contact details."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="Store name"
            name="store_name"
            defaultValue={settings.store_name}
            error={state.fieldErrors.store_name}
            disabled={isPending}
            required
          />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            defaultValue={settings.phone}
            error={state.fieldErrors.phone}
            disabled={isPending}
            required
          />
          <TextareaField
            label="Address"
            name="address"
            rows={3}
            defaultValue={settings.address}
            error={state.fieldErrors.address}
            disabled={isPending}
          />
          <TextareaField
            label="Working hours"
            name="working_hours"
            rows={3}
            defaultValue={settings.working_hours}
            error={state.fieldErrors.working_hours}
            disabled={isPending}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Social Links"
        description="Public links used by contact actions across the website."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="Zalo URL"
            name="zalo_url"
            type="url"
            defaultValue={settings.zalo_url}
            error={state.fieldErrors.zalo_url}
            disabled={isPending}
            placeholder="https://zalo.me/..."
          />
          <Field
            label="Facebook URL"
            name="facebook_url"
            type="url"
            defaultValue={settings.facebook_url}
            error={state.fieldErrors.facebook_url}
            disabled={isPending}
            placeholder="https://facebook.com/..."
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Google Map"
        description="In Google Maps, use Share > Embed a map and paste the iframe URL."
      >
        <TextareaField
          label="Google Maps embed URL"
          name="google_map_embed"
          rows={4}
          defaultValue={settings.google_map_embed}
          error={state.fieldErrors.google_map_embed}
          disabled={isPending}
          placeholder="https://www.google.com/maps/embed?..."
        />
      </SettingsSection>

      <SettingsSection
        title="SEO Defaults"
        description="Fallback metadata for pages without page-specific SEO values."
      >
        <div className="grid gap-4">
          <Field
            label="Default SEO title"
            name="default_seo_title"
            defaultValue={settings.default_seo_title}
            error={state.fieldErrors.default_seo_title}
            disabled={isPending}
          />
          <TextareaField
            label="Default SEO description"
            name="default_seo_description"
            rows={4}
            defaultValue={settings.default_seo_description}
            error={state.fieldErrors.default_seo_description}
            disabled={isPending}
          />
        </div>
      </SettingsSection>

      {state.message ? (
        <p
          role="status"
          className={`rounded-md px-4 py-3 text-sm font-semibold ${
            state.success
              ? "bg-[#DCFCE7] text-[#166534]"
              : "bg-[#FEE2E2] text-[#991B1B]"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}

type SettingsSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[#111827]">{title}</h3>
      <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: keyof SettingsMap;
  defaultValue: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  type?: "text" | "tel" | "url";
  placeholder?: string;
};

function Field({
  label,
  name,
  defaultValue,
  error,
  disabled,
  required,
  type = "text",
  placeholder,
}: FieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#111827]">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
      />
      {error ? (
        <p className="text-sm font-normal text-[#B91C1C]">{error}</p>
      ) : null}
    </label>
  );
}

type TextareaFieldProps = {
  label: string;
  name: keyof SettingsMap;
  rows: number;
  defaultValue: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
};

function TextareaField({
  label,
  name,
  rows,
  defaultValue,
  error,
  disabled,
  placeholder,
}: TextareaFieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#111827]">
      {label}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
      />
      {error ? (
        <p className="text-sm font-normal text-[#B91C1C]">{error}</p>
      ) : null}
    </label>
  );
}
