/**
 * @deprecated These patch methods are no longer needed.
 * Use the official Supabase SSR patterns instead.
 * 
 * - For server components: import { createClient } from '@/utils/supabase/server'
 * - For client components: import { useAuth } from '@/components/auth/client-auth-provider'
 */

// Import the client to provide a consistent instance
import { createClient as createBrowserClient } from '@/utils/supabase/client'

/**
 * @deprecated Use createClient from utils/supabase/client.ts instead
 */
export function getSingletonSupabaseClient<T>(key: string, factory: () => T): T {
  // Log a deprecation warning in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'Deprecation warning: getSingletonSupabaseClient is deprecated. ' +
      'Use createClient from @/utils/supabase/client instead.'
    )
  }
  
  // Return the client from our new implementation
  return createBrowserClient() as unknown as T;
}
