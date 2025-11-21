/**
 * Crypto utilities for ZK Identity
 * Main entry point for encryption, Shamir Secret Sharing, and hashing
 */

import { generateEncryptionKey, encryptData as encrypt, decryptData as decrypt, hashData } from './encryption'
import {
  createShamirShares as createShares,
  reconstructFromShares as reconstructShares,
  generateFragmentMetadata,
  validateShare
} from './shamir'

// Re-export encryption functions
export { generateEncryptionKey, hashData }

/**
 * Encrypt data using AES-256-GCM
 * @param data - Data to encrypt
 * @param key - Encryption key (hex string)
 * @returns Encrypted data with IV and auth tag
 */
export async function encryptData(data: string, key: string): Promise<string> {
  const result = await encrypt(data, key)
  // Return as JSON string for easy storage
  return JSON.stringify(result)
}

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedData - Encrypted data (JSON string with iv and authTag)
 * @param key - Decryption key
 * @returns Decrypted data
 */
export async function decryptData(encryptedData: string, key: string): Promise<string> {
  const parsed = JSON.parse(encryptedData)
  return decrypt(parsed.encryptedData, key, parsed.iv, parsed.authTag)
}

/**
 * Split data into Shamir Secret Sharing fragments
 * @param data - Data to split
 * @param totalShares - Total number of shares (default: 5)
 * @param threshold - Minimum shares needed (default: 3)
 * @returns Array of fragments
 */
export function createShamirShares(
  data: string,
  totalShares: number = 5,
  threshold: number = 3
): string[] {
  return createShares(data, totalShares, threshold)
}

/**
 * Reconstruct data from Shamir fragments
 * @param shares - Array of shares (minimum threshold needed)
 * @returns Reconstructed data
 */
export function reconstructFromShares(shares: string[]): string {
  return reconstructShares(shares)
}

/**
 * Generate a secure random key
 * @returns Random key as hex string
 */
export function generateRandomKey(): string {
  return generateEncryptionKey()
}

/**
 * Complete protection pipeline: Encrypt + Fragment
 * @param data - Data to protect
 * @param key - Encryption key (optional, will generate if not provided)
 * @returns Encrypted fragments and metadata
 */
export async function protectData(
  data: string,
  key?: string
): Promise<{
  fragments: string[]
  encryptionKey: string
  metadata: {
    totalFragments: number
    threshold: number
    createdAt: string
  }
}> {
  try {
    // 1. Generate key if not provided
    const encryptionKey = key || generateEncryptionKey()

    // 2. Encrypt data
    const encrypted = await encryptData(data, encryptionKey)

    // 3. Create Shamir shares (3-of-5)
    const fragments = createShamirShares(encrypted, 5, 3)

    return {
      fragments,
      encryptionKey,
      metadata: {
        totalFragments: 5,
        threshold: 3,
        createdAt: new Date().toISOString()
      }
    }
  } catch (error) {
    throw new Error(`Failed to protect data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Complete recovery pipeline: Reconstruct + Decrypt
 * @param fragments - Array of fragments (minimum 3 needed)
 * @param encryptionKey - Encryption key
 * @returns Original decrypted data
 */
export async function recoverData(
  fragments: string[],
  encryptionKey: string
): Promise<string> {
  try {
    // Validate we have enough fragments
    if (fragments.length < 3) {
      throw new Error(`Insufficient fragments: ${fragments.length}/3 minimum required`)
    }

    // 1. Reconstruct encrypted data from fragments
    const encrypted = reconstructFromShares(fragments.slice(0, 3))

    // 2. Decrypt data
    const decrypted = await decryptData(encrypted, encryptionKey)

    return decrypted
  } catch (error) {
    throw new Error(`Failed to recover data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Re-export utility functions
export { generateFragmentMetadata, validateShare }

// Export types
export interface ProtectionResult {
  fragments: string[]
  encryptionKey: string
  metadata: {
    totalFragments: number
    threshold: number
    createdAt: string
  }
}

export interface EncryptedData {
  encryptedData: string
  iv: string
  authTag: string
}
