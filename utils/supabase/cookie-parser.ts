/**
 * Custom cookie parser for Supabase cookies
 * This file provides utilities to correctly handle Supabase's base64-encoded cookies
 */

/**
 * Parse a cookie string value that might be base64-encoded JSON
 * @param str The cookie value string
 * @returns The parsed data or null if parsing fails
 */
export function parseSupabaseCookie(str: string | null | undefined): any {
  if (!str) return null;
  
  try {
    // Handle base64 prefixed cookies
    if (str.startsWith('base64-')) {
      // Don't try to parse - just return the raw string
      // Supabase will handle this internally
      return str;
    }
    
    // Try to parse as JSON
    return JSON.parse(str);
  } catch (error) {
    console.warn('Failed to parse cookie value:', error);
    // Return the raw string if parsing fails
    return str;
  }
}

/**
 * Format a value to be stored as a cookie
 * @param obj The value to format
 * @returns Formatted string
 */
export function stringifySupabaseCookie(obj: any): string {
  if (typeof obj === 'string') {
    return obj;
  }
  
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('Failed to stringify cookie value:', error);
    return '';
  }
}
