/**
 * Getting started card for new users
 */

import Link from 'next/link';
import { TrendingUp, Plus, Settings } from 'lucide-react';
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function GettingStarted() {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
            <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="text-white" size={32} />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Get Started with FormBuilder
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Create beautiful forms in minutes. Collect responses, analyze data,
                        and communicate with your students all in one place.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <PermissionGate permission={PERMISSIONS.MANAGE_FORMS}>
                            <Link
                                href="/dashboard/forms/create"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={20} />
                                Create Your First Form
                            </Link>
                        </PermissionGate>
                        <PermissionGate permission={PERMISSIONS.MANAGE_SETTINGS}>
                            <Link
                                href="/dashboard/settings"
                                className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <Settings size={20} />
                                Configure Settings
                            </Link>
                        </PermissionGate>
                    </div>
                </div>
            </div>
        </div>
    );
}
