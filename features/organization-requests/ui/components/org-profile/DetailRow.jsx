/**
 * Reusable detail row with icon, label, and value.
 */
export function DetailRow({ icon: Icon, label, children }) {
    if (!children) return null;
    return (
        <div className="flex items-start gap-3 py-2">
            <Icon size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {label}
                </p>
                <div className="text-sm text-gray-900 mt-0.5">{children}</div>
            </div>
        </div>
    );
}
