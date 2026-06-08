"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type RichTextEditorProps = {
  content: string;
  disabled?: boolean;
  onChange: (content: string) => void;
};

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
};

function ToolbarButton({
  active = false,
  disabled = false,
  label,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={
        active
          ? "min-h-9 rounded-md bg-[#E0F2FE] px-3 text-xs font-bold text-[#0369A1]"
          : "min-h-9 rounded-md border border-[#E5E7EB] bg-white px-3 text-xs font-bold text-[#374151] hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {label}
    </button>
  );
}

function isAllowedUrl(value: string): boolean {
  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }

  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function isAllowedImageUrl(value: string): boolean {
  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function RichTextEditor({
  content,
  disabled = false,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        heading: {
          levels: [2, 3],
        },
        horizontalRule: false,
        link: false,
        strike: false,
        underline: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: false,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        allowBase64: false,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        "aria-label": "Blog post content",
        class:
          "min-h-80 px-4 py-3 text-sm leading-7 text-[#374151] outline-none [&_a]:font-semibold [&_a]:text-[#0284C7] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#BAE6FD] [&_blockquote]:pl-4 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#111827] [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#111827] [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-md [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor || editor.getHTML() === content) {
      return;
    }

    const { from, to } = editor.state.selection;

    // Manual HTML edits update the parent state while Tiptap may stay mounted.
    // Suppressing the update event prevents this external sync from feeding
    // back into onChange and creating an editor <-> React update loop.
    editor.commands.setContent(content, {
      emitUpdate: false,
    });

    // Keep the previous cursor/selection when those positions still exist in
    // the replacement document, otherwise move them to the nearest valid spot.
    const maxPosition = editor.state.doc.content.size;
    const nextFrom = Math.min(from, maxPosition);
    const nextTo = Math.max(nextFrom, Math.min(to, maxPosition));

    editor.commands.setTextSelection({
      from: nextFrom,
      to: nextTo,
    });
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="min-h-80 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm text-[#6B7280]">
        Loading rich text editor...
      </div>
    );
  }

  function setLink() {
    const previousUrl = editor?.getAttributes("link").href as
      | string
      | undefined;
    const url = window.prompt(
      "Enter an internal path or full link URL",
      previousUrl ?? "/",
    );

    if (url === null) {
      return;
    }

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    if (!isAllowedUrl(trimmedUrl)) {
      window.alert("Use an internal path or an HTTP, HTTPS, mailto, or tel URL.");
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: trimmedUrl })
      .run();
  }

  function insertImage() {
    const imageUrl = window.prompt(
      "Enter an HTTP/HTTPS image URL or a site-relative path",
      "https://",
    );

    if (imageUrl === null) {
      return;
    }

    const trimmedUrl = imageUrl.trim();

    if (!isAllowedImageUrl(trimmedUrl)) {
      window.alert("Use an HTTP/HTTPS image URL or a path starting with /.");
      return;
    }

    const altText = window.prompt(
      "Describe the image for accessibility and SEO",
      "",
    );

    if (altText === null) {
      return;
    }

    const trimmedAltText = altText.trim();

    if (!trimmedAltText) {
      window.alert("Add descriptive alt text before inserting the image.");
      return;
    }

    editor
      ?.chain()
      .focus()
      .setImage({ src: trimmedUrl, alt: trimmedAltText })
      .run();
  }

  return (
    <div className="overflow-hidden rounded-md border border-[#E5E7EB] bg-white focus-within:border-[#0EA5E9] focus-within:ring-2 focus-within:ring-[#0EA5E9]/20">
      <div
        role="toolbar"
        aria-label="Content formatting"
        className="flex flex-wrap gap-2 border-b border-[#E5E7EB] bg-[#F8FAFC] p-3"
      >
        <ToolbarButton
          label="Paragraph"
          active={editor.isActive("paragraph")}
          disabled={disabled}
          onClick={() => editor.chain().focus().setParagraph().run()}
        />
        <ToolbarButton
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="H3"
          active={editor.isActive("heading", { level: 3 })}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          label={editor.isActive("link") ? "Edit link" : "Link"}
          active={editor.isActive("link")}
          disabled={disabled}
          onClick={setLink}
        />
        <ToolbarButton
          label="Image URL"
          disabled={disabled}
          onClick={insertImage}
        />
        <ToolbarButton
          label="Undo"
          disabled={disabled || !editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          label="Redo"
          disabled={disabled || !editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
