import Link from 'next/link';

export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            {Icon && <Icon className="mx-auto text-gray-300 mb-4" size={48} />}
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
            <p className="text-gray-500 mb-4">{description}</p>
            {action && (
                <Link
                    href={action.href}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {action.icon && <action.icon size={20} />}
                    {action.label}
                </Link>
            )}
        </div>
    );
}
