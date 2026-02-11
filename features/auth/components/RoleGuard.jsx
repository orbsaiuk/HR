'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

export function RoleGuard({ children, allowedRoles }) {
    const { user } = useUser()

    const userRole = user?.publicMetadata?.role

    // Debug logging
    console.log('User:', user)
    console.log('Public Metadata:', user?.publicMetadata)
    console.log('User Role:', userRole)

    if (!userRole || !allowedRoles.includes(userRole)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">
                        You need the <span className="font-semibold text-blue-600">{allowedRoles.join(' or ')}</span> role to access this page.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Current role: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userRole || 'none'}</span>
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
