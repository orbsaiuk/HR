/**
 * A link that activates the user's organization before navigating
 * to the dashboard. Used in both desktop and mobile navs.
 */
export function DashboardLink({ navigateToDashboard, className, onBeforeNavigate }) {
    return (
        <a
            href="/dashboard"
            className={className}
            onClick={async (e) => {
                e.preventDefault();
                onBeforeNavigate?.();
                await navigateToDashboard();
            }}
        >
            لوحة التحكم
        </a>
    );
}
