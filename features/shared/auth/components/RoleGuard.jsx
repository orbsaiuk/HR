'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export function RoleGuard({ children, allowedRoles }) {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    const userRole = user?.publicMetadata?.role

    useEffect(() => {
        if (isLoaded && (!userRole || !allowedRoles.includes(userRole))) {
            router.replace('/')
        }
    }, [isLoaded, userRole, allowedRoles, router])

    // While loading or redirecting, show nothing
    if (!isLoaded || !userRole || !allowedRoles.includes(userRole)) {
        return null
    }

    return <>{children}</>
}
