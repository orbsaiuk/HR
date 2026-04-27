import { Button } from "@/components/ui/button";

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
      {Icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5FF] text-[#5D5BDA]">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <div className="space-y-1">
        <p className="text-base font-semibold text-slate-700">{title}</p>
        {description ? (
          <p className="text-sm text-slate-400">{description}</p>
        ) : null}
      </div>
      {actionLabel && onAction ? (
        <Button
          type="button"
          variant="outline"
          className="mt-1 h-10 rounded-xl border-[#E0E0FF] bg-[#F7F7FF] px-5 text-sm font-bold text-[#5D5BDA] hover:bg-[#EBEBFF] hover:text-[#4A48C9]"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
