/**
 * Shamir Secret Sharing (3-of-5)
 * Split secrets into fragments where any 3 can reconstruct the original
 */

import secrets from 'secrets.js-34r7h'

/**
 * Create Shamir Secret Sharing fragments
 * @param secret - Secret to split (string)
 * @param totalShares - Total number of shares to create (default: 5)
 * @param threshold - Minimum shares needed to reconstruct (default: 3)
 * @returns Array of share fragments as hex strings
 */
export function createShamirShares(
  secret: string,
  totalShares: number = 5,
  threshold: number = 3
): string[] {
  // Validation
  if (threshold > totalShares) {
    throw new Error('Threshold cannot be greater than total shares')
  }

  if (threshold < 2) {
    throw new Error('Threshold must be at least 2')
  }

  if (totalShares < 2) {
    throw new Error('Total shares must be at least 2')
  }

  try {
    // Convert secret to hex if it's not already
    const hexSecret = stringToHex(secret)

    // Create shares using secrets.js
    // secrets.js expects hex strings and returns hex strings
    const shares = secrets.share(hexSecret, totalShares, threshold)

    return shares
  } catch (error) {
    throw new Error(`Failed to create Shamir shares: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Reconstruct secret from Shamir shares
 * @param shares - Array of share fragments (minimum 'threshold' shares needed)
 * @returns Reconstructed secret
 */
export function reconstructFromShares(shares: string[]): string {
  // Validation
  if (!shares || shares.length === 0) {
    throw new Error('No shares provided for reconstruction')
  }

  if (shares.length < 2) {
    throw new Error('At least 2 shares are required for reconstruction')
  }

  try {
    // Combine shares to reconstruct the hex secret
    const hexSecret = secrets.combine(shares)

    // Convert hex back to string
    const secret = hexToString(hexSecret)

    return secret
  } catch (error) {
    throw new Error(`Failed to reconstruct from shares: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate metadata for each fragment
 * Useful for tracking and managing fragments
 */
export function generateFragmentMetadata(
  fragmentIndex: number,
  totalFragments: number,
  threshold: number,
  createdAt: Date = new Date()
) {
  return {
    index: fragmentIndex,
    totalFragments,
    threshold,
    createdAt: createdAt.toISOString(),
    id: `frag_${fragmentIndex}_${Date.now()}`,
    location: getLocationByIndex(fragmentIndex)
  }
}

/**
 * Get storage location by fragment index
 */
function getLocationByIndex(index: number): string {
  const locations = ['local', 'stellar', 'supabase', 'redis', 'ipfs']
  return locations[index] || 'unknown'
}

/**
 * Validate share format
 * Checks if a share is in valid hex format
 */
export function validateShare(share: string): boolean {
  if (!share || typeof share !== 'string') {
    return false
  }

  // secrets.js shares are hex strings
  return /^[0-9a-fA-F]+$/.test(share)
}

/**
 * Convert string to hex
 */
function stringToHex(str: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Convert hex to string
 */
function hexToString(hex: string): string {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}

/**
 * Test if shares can be reconstructed
 * Useful for validation
 */
export function testReconstruction(shares: string[], originalSecret: string): boolean {
  try {
    const reconstructed = reconstructFromShares(shares)
    return reconstructed === originalSecret
  } catch {
    return false
  }
}

/**
 * Get minimum shares needed from metadata
 */
export function getMinimumSharesNeeded(share: string): number {
  // This is a simplified version
  // In production, you'd parse the share metadata
  return 3 // Default threshold for 3-of-5
}
