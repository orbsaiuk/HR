export function Loading({ fullPage = false }) {
    return (
        <div className={`flex items-center justify-center ${fullPage ? 'h-64' : ''}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
}
