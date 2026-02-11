import { cn } from "@/lib/utils";

export function MarkdownContent({ content, className }) {
  if (!content) return null;

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none",
        "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1",
        "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1",
        "[&_h4]:text-sm [&_h4]:font-semibold [&_h4]:mt-2 [&_h4]:mb-0.5",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
        "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-2",
        "[&_a]:text-blue-600 [&_a]:underline",
        "[&_hr]:my-3 [&_hr]:border-border",
        "[&_p]:my-1.5 [&_p]:leading-relaxed",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
