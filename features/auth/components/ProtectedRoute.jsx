'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }) {
    const { isLoaded, userId } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (isLoaded && !userId) {
            // Preserve the current URL to redirect back after sign-in
            const returnUrl = encodeURIComponent(pathname)
            router.push(`/sign-in?redirect_url=${returnUrl}`)
        }
    }, [isLoaded, userId, router, pathname])

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    if (!userId) {
        return null
    }

    return <>{children}</>
}
