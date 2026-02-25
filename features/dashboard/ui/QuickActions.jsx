/**
 * Quick action cards for dashboard
 */

import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function QuickActions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PermissionGate permission={PERMISSIONS.MANAGE_FORMS}>
                <Link
                    href="/dashboard/forms/create"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm p-6 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Create New Form</h3>
                            <p className="text-blue-100">
                                Start building a new form from scratch
                            </p>
                        </div>
                        <Plus size={32} />
                    </div>
                </Link>
            </PermissionGate>

            <PermissionGate permission={PERMISSIONS.VIEW_FORMS}>
                <Link
                    href="/dashboard/forms"
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">View All Forms</h3>
                            <p className="text-gray-600">
                                Manage and edit your existing forms
                            </p>
                        </div>
                        <ArrowRight className="text-gray-400" size={32} />
                    </div>
                </Link>
            </PermissionGate>
        </div>
    );
}
