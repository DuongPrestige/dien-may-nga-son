"use client";

import { Sparkles } from "lucide-react";
import { useRef, useState, useTransition } from "react";

import { generateSeoSuggestionAction } from "@/src/features/ai-seo/actions/ai-seo.actions";
import type {
  AiSeoEntityType,
  AiSeoSuggestion,
} from "@/src/features/ai-seo/types/ai-seo.types";

type AiSeoTargetFieldNames = Record<keyof AiSeoSuggestion, string>;

type AiSeoButtonProps = {
  entityType: AiSeoEntityType;
  titleFieldName?: string;
  contentFieldName?: string;
  locationFieldNames?: readonly string[];
  targetFieldNames?: AiSeoTargetFieldNames;
  disabled?: boolean;
};

const DEFAULT_LOCATION_FIELD_NAMES = ["location"] as const;
const DEFAULT_TARGET_FIELD_NAMES: AiSeoTargetFieldNames = {
  seoTitle: "seoTitle",
  seoDescription: "seoDescription",
  excerpt: "excerpt",
};

type FormValueElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

function getFormElement(
  form: HTMLFormElement,
  name: string,
): FormValueElement | null {
  const element = form.elements.namedItem(name);

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  ) {
    return element;
  }

  return null;
}

function readFieldValue(form: HTMLFormElement, name: string): string {
  return getFormElement(form, name)?.value.trim() ?? "";
}

/**
 * Sets a field value through the native setter and dispatches input/change
 * events so both uncontrolled fields and React-controlled state update.
 */
function writeFieldValue(form: HTMLFormElement, name: string, value: string) {
  const element = getFormElement(form, name);
  if (!element) {
    return;
  }

  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : element instanceof HTMLSelectElement
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

  if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }

  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

export function AiSeoButton({
  entityType,
  titleFieldName = "title",
  contentFieldName = "content",
  locationFieldNames = DEFAULT_LOCATION_FIELD_NAMES,
  targetFieldNames = DEFAULT_TARGET_FIELD_NAMES,
  disabled = false,
}: AiSeoButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  function handleClick() {
    const form = buttonRef.current?.closest("form");
    if (!form) {
      setStatus({ tone: "error", message: "Không tìm thấy biểu mẫu." });
      return;
    }

    const title = readFieldValue(form, titleFieldName);
    if (!title) {
      setStatus({
        tone: "error",
        message: "Vui lòng nhập tiêu đề trước khi tạo gợi ý SEO.",
      });
      return;
    }

    const targetNames = Object.values(targetFieldNames);
    const hasExistingValues = targetNames.some((name) =>
      Boolean(readFieldValue(form, name)),
    );
    if (
      hasExistingValues &&
      !window.confirm(
        "Gợi ý AI sẽ ghi đè SEO title, SEO description và mô tả ngắn hiện tại. Tiếp tục?",
      )
    ) {
      return;
    }

    const location = locationFieldNames
      .map((name) => readFieldValue(form, name))
      .filter(Boolean)
      .join(", ");

    setStatus(null);
    startTransition(async () => {
      try {
        const result = await generateSeoSuggestionAction({
          entityType,
          title,
          location: location || undefined,
          content: readFieldValue(form, contentFieldName),
        });

        if (!result.success) {
          setStatus({ tone: "error", message: result.message });
          return;
        }

        writeFieldValue(form, targetFieldNames.seoTitle, result.data.seoTitle);
        writeFieldValue(
          form,
          targetFieldNames.seoDescription,
          result.data.seoDescription,
        );
        writeFieldValue(form, targetFieldNames.excerpt, result.data.excerpt);
        setStatus({
          tone: "success",
          message: "Đã điền gợi ý SEO. Hãy đọc lại và chỉnh sửa trước khi lưu.",
        });
      } catch {
        setStatus({
          tone: "error",
          message: "Không thể kết nối máy chủ. Vui lòng thử lại.",
        });
      }
    });
  }

  return (
    <div className="space-y-2">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        disabled={disabled || isPending}
        aria-busy={isPending}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#0EA5E9] bg-[#F0F9FF] px-4 text-sm font-bold text-[#0369A1] hover:bg-[#E0F2FE] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Sparkles aria-hidden="true" className="size-4" />
        {isPending ? "Đang tạo gợi ý SEO..." : "Gợi ý SEO bằng AI"}
      </button>
      {status ? (
        <p
          role={status.tone === "error" ? "alert" : "status"}
          className={`text-sm ${
            status.tone === "error" ? "text-red-600" : "text-green-700"
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
