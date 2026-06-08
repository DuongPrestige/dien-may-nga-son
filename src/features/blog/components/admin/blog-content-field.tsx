"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useState } from "react";

const RichTextEditor = dynamic(
  () =>
    import(
      "@/src/features/blog/components/admin/rich-text-editor"
    ).then((module) => module.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-80 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm text-[#6B7280]">
        Loading rich text editor...
      </div>
    ),
  },
);

type BlogContentFieldProps = {
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
};

type EditorErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type EditorErrorBoundaryState = {
  hasError: boolean;
};

class EditorErrorBoundary extends Component<
  EditorErrorBoundaryProps,
  EditorErrorBoundaryState
> {
  state: EditorErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): EditorErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

type ManualContentEditorProps = {
  content: string;
  disabled?: boolean;
  onChange: (content: string) => void;
};

function ManualContentEditor({
  content,
  disabled,
  onChange,
}: ManualContentEditorProps) {
  return (
    <textarea
      value={content}
      rows={16}
      disabled={disabled}
      aria-label="Blog post content HTML"
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 font-mono text-sm font-normal leading-6 outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
    />
  );
}

export function BlogContentField({
  defaultValue = "",
  disabled = false,
  error,
}: BlogContentFieldProps) {
  const [content, setContent] = useState(defaultValue);
  const [isManualMode, setIsManualMode] = useState(false);
  const manualEditor = (
    <ManualContentEditor
      content={content}
      disabled={disabled}
      onChange={setContent}
    />
  );
  const editorFailureFallback = (
    <div className="space-y-2">
      <p role="alert" className="text-sm font-semibold text-amber-800">
        The rich text editor could not load. Continue with the HTML editor.
      </p>
      {manualEditor}
    </div>
  );

  return (
    <div className="space-y-2 lg:col-span-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-semibold text-[#111827]">Content</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsManualMode((currentMode) => !currentMode)}
          className="self-start text-xs font-bold text-[#0284C7] hover:text-[#0369A1] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isManualMode ? "Use rich text editor" : "Edit HTML manually"}
        </button>
      </div>

      <input name="content" type="hidden" value={content} />

      {isManualMode ? (
        manualEditor
      ) : (
        <EditorErrorBoundary fallback={editorFailureFallback}>
          <RichTextEditor
            content={content}
            disabled={disabled}
            onChange={setContent}
          />
        </EditorErrorBoundary>
      )}

      <p className="text-xs leading-5 text-[#6B7280]">
        Use H2 and H3 headings, readable paragraphs, descriptive image alt
        text, and internal links to relevant products, services, or contact
        pages.
      </p>

      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
