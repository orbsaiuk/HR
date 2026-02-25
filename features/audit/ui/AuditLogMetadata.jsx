"use client";

/**
 * Try to parse a JSON string, returning the parsed object or null.
 */
function tryParseJSON(str) {
    if (!str) return null;
    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
}

/**
 * Render a JSON object as a formatted key-value list.
 * Used in the expanded row of the audit log table.
 */
export function AuditLogMetadata({ label, data }) {
    if (!data) return null;
    const parsed = typeof data === "string" ? tryParseJSON(data) : data;
    if (!parsed || (typeof parsed === "object" && Object.keys(parsed).length === 0)) {
        return null;
    }

    return (
        <div>
            <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
            <pre className="text-xs bg-gray-50 rounded p-2 overflow-x-auto whitespace-pre-wrap break-words text-gray-700">
                {JSON.stringify(parsed, null, 2)}
            </pre>
        </div>
    );
}
