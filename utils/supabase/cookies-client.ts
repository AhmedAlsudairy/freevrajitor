/**
 * This file is a wrapper around the server.ts createClient function
 * It's primarily kept for backward compatibility with existing code
 * New code should directly use createClient from server.ts
 */

import { createClient as createServerClient } from './server'

/**
 * Creates a Supabase client for server components
 * @deprecated Use createClient from '@/utils/supabase/server' instead
 */
export async function createSupabaseServerClient() {
  return createServerClient()
}
