'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { customArabic } from '../localization/clerkLocalization'

export function AuthProvider({ children }) {
    return (
        <ClerkProvider localization={customArabic}>
            {children}
        </ClerkProvider>
    )
}
