/**
 * Utility functions for handling JWT tokens
 */

/**
 * Cleans a JWT token by removing surrounding quotes if present
 * @param token - The token to clean
 * @returns The cleaned token or null if token is falsy
 */
export const cleanToken = (token: string | null | undefined): string | null => {
  if (!token) return null;
  // Remove surrounding quotes if present
  return token.replace(/^"(.*)"$/, '$1');
};

/**
 * Gets a clean token from localStorage
 * @returns The cleaned token or null if not found
 */
export const getCleanTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem("token");
  return cleanToken(token);
};

/**
 * Gets a clean token from Redux state or localStorage as fallback
 * @param reduxToken - The token from Redux state
 * @returns The cleaned token or null if not found
 */
export const getCleanToken = (reduxToken: string | null | undefined): string | null => {
  const cleanReduxToken = cleanToken(reduxToken);
  if (cleanReduxToken) return cleanReduxToken;
  
  return getCleanTokenFromStorage();
};

/**
 * Validates if a token is properly formatted (no surrounding quotes)
 * @param token - The token to validate
 * @returns true if token is clean, false otherwise
 */
export const isTokenClean = (token: string | null | undefined): boolean => {
  if (!token) return false;
  return !token.startsWith('"') && !token.endsWith('"');
};

/**
 * Forces a token cleanup by clearing localStorage and reloading
 * This should only be used in development
 */
export const forceTokenCleanup = (): void => {
  if (typeof window === 'undefined') return;
  
  console.log("🧹 Forcing token cleanup...");
  localStorage.clear();
  console.log("✅ localStorage cleared, reloading page...");
  window.location.reload();
};


