"use client"

/**
 * DEPRECATED: Use the useAuth hook from '@/components/auth/client-auth-provider' instead
 * This hook is kept for backward compatibility but delegates to the new implementation
 */

import { useAuth as useClientAuth } from "@/components/auth/client-auth-provider"
import type { User } from "@supabase/supabase-js"

/**
 * @deprecated Use the useAuth hook from '@/components/auth/client-auth-provider' instead
 */
export function useAuth() {
  // Use the new client auth provider hook instead
  const { user, isLoading: loading, supabase } = useClientAuth()
  
  // Log a deprecation warning in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'Deprecation warning: The useAuth hook in @/hooks/use-auth.ts is deprecated. ' +
      'Use the useAuth hook from @/components/auth/client-auth-provider instead.'
    )
  }

  // Return the same interface as before for backward compatibility
  return { user, loading, supabase }
}
