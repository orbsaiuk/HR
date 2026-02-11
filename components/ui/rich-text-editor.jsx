"use client";

import * as React from "react";
import { useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Quote,
  Minus,
  RemoveFormatting,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Toolbar configuration                                              */
/* ------------------------------------------------------------------ */

const TOOLBAR_GROUPS = [
  {
    label: "Headings",
    items: [
      { icon: Heading1, label: "Heading 1", command: "formatBlock", arg: "h2" },
      { icon: Heading2, label: "Heading 2", command: "formatBlock", arg: "h3" },
      { icon: Heading3, label: "Heading 3", command: "formatBlock", arg: "h4" },
    ],
  },
  {
    label: "Formatting",
    items: [
      { icon: Bold, label: "Bold", command: "bold" },
      { icon: Italic, label: "Italic", command: "italic" },
    ],
  },
  {
    label: "Blocks",
    items: [
      { icon: List, label: "Bullet List", command: "insertUnorderedList" },
      {
        icon: ListOrdered,
        label: "Numbered List",
        command: "insertOrderedList",
      },
      {
        icon: Quote,
        label: "Blockquote",
        command: "formatBlock",
        arg: "blockquote",
      },
      { icon: Minus, label: "Divider", command: "insertHorizontalRule" },
    ],
  },
  {
    label: "Insert",
    items: [{ icon: Link2, label: "Link", command: "createLink" }],
  },
  {
    label: "Clear",
    items: [
      {
        icon: RemoveFormatting,
        label: "Clear Formatting",
        command: "removeFormat",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Toolbar button                                                     */
/* ------------------------------------------------------------------ */

const ToolbarButton = React.forwardRef(
  ({ icon: Icon, label, active, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        active && "bg-accent text-accent-foreground",
      )}
      {...props}
    >
      <Icon size={16} />
    </button>
  ),
);
ToolbarButton.displayName = "ToolbarButton";

/* ------------------------------------------------------------------ */
/*  RichTextEditor                                                     */
/* ------------------------------------------------------------------ */

const RichTextEditor = React.forwardRef(
  (
    { value, onChange, placeholder, rows = 6, className, id, name, ...props },
    ref,
  ) => {
    const editorRef = useRef(null);
    const isInternalChange = useRef(false);

    // Expose the editable element
    React.useImperativeHandle(ref, () => editorRef.current);

    // Sync external value → editor only when it differs (and not our own edit)
    useEffect(() => {
      if (isInternalChange.current) {
        isInternalChange.current = false;
        return;
      }
      const el = editorRef.current;
      if (!el) return;
      const incoming = value ?? "";
      if (el.innerHTML !== incoming) {
        el.innerHTML = incoming;
      }
    }, [value]);

    // Emit changes from the contentEditable
    const handleInput = useCallback(() => {
      const el = editorRef.current;
      if (!el) return;
      isInternalChange.current = true;
      onChange?.(el.innerHTML);
    }, [onChange]);

    // Execute a toolbar command
    const exec = useCallback(
      (item) => {
        editorRef.current?.focus();

        if (item.command === "createLink") {
          const url = prompt("Enter URL:");
          if (!url) return;
          document.execCommand("createLink", false, url);
        } else if (item.command === "formatBlock") {
          document.execCommand("formatBlock", false, `<${item.arg}>`);
        } else {
          document.execCommand(item.command, false, item.arg ?? null);
        }

        // Notify parent of the change
        handleInput();
      },
      [handleInput],
    );

    // Handle paste — strip formatting to keep things clean
    const handlePaste = useCallback(
      (e) => {
        e.preventDefault();
        const text =
          e.clipboardData.getData("text/html") ||
          e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
        handleInput();
      },
      [handleInput],
    );

    return (
      <div
        className={cn("rounded-md border border-input shadow-sm", className)}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 flex-wrap border-b border-input bg-muted/40 px-2 py-1.5 rounded-t-md">
          {TOOLBAR_GROUPS.map((group, gi) => (
            <React.Fragment key={group.label}>
              {gi > 0 && (
                <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
              )}
              {group.items.map((item) => (
                <ToolbarButton
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  onMouseDown={(e) => {
                    // Prevent stealing focus from the editable area
                    e.preventDefault();
                    exec(item);
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Editable area */}
        <div
          ref={editorRef}
          id={id}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-placeholder={placeholder}
          onInput={handleInput}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          className={cn(
            "rich-editor min-h-[120px] w-full bg-transparent px-3 py-2 text-base text-gray-900 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-b-md",
            "prose prose-sm max-w-none",
            "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1",
            "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1",
            "[&_h4]:text-sm [&_h4]:font-semibold [&_h4]:mt-2 [&_h4]:mb-0.5",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
            "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1",
            "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-2",
            "[&_a]:text-blue-600 [&_a]:underline",
            "[&_hr]:my-3 [&_hr]:border-border",
          )}
          style={{ minHeight: `${rows * 1.5 + 1}rem` }}
          {...props}
        />
      </div>
    );
  },
);
RichTextEditor.displayName = "RichTextEditor";

export { RichTextEditor };
