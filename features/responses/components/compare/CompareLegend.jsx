'use client';

export function CompareLegend({ show }) {
    if (!show) return null;

    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span>Highlighted rows indicate fields where responses differ</span>
        </div>
    );
}
