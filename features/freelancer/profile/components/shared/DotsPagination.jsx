"use client";

export function DotsPagination({ total, perPage, currentPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`صفحة ${i + 1}`}
          onClick={() => onChange(i)}
          className={`h-2.5 rounded-full transition-all ${
            i === currentPage ? "w-6 bg-[#5D5BDA]" : "w-2.5 bg-slate-200 hover:bg-slate-300"
          }`}
        />
      ))}
    </div>
  );
}
