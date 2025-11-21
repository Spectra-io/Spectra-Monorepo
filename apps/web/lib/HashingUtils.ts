/**
 * Hashing Utilities
 * SHA-256, SHA-512, and conversion helpers
 */

export interface HashResult {
  hash: string
  algorithm: 'SHA-256' | 'SHA-512'
  timestamp: Date
}

/**
 * Generate SHA-256 hash of data
 * @param data - Data to hash (string)
 * @returns Hash as hex string
 */
export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

/**
 * Generate SHA-512 hash (more secure, longer)
 */
export async function sha512(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-512', dataBuffer)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

/**
 * Generate unique identifier by combining multiple data points
 * @param dni - DNI number
 * @param publicKey - Biometric public key
 * @param timestamp - Registration timestamp
 * @returns Unique hash identifier
 */
export async function generateUniqueIdentifier(
  dni: string,
  publicKey: string,
  timestamp: number = Date.now()
): Promise<string> {
  // Combine data for unique identifier
  const combined = `${dni}:${publicKey}:${timestamp}`

  // Hash the combination
  const hash = await sha256(combined)

  return hash
}

/**
 * Generate random salt for hashing
 */
export function generateSalt(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Hash with salt (more secure)
 */
export async function sha256WithSalt(data: string, salt?: string): Promise<HashResult> {
  const usedSalt = salt || generateSalt()
  const combined = `${data}${usedSalt}`
  const hash = await sha256(combined)

  return {
    hash: `${hash}:${usedSalt}`, // Store salt with hash
    algorithm: 'SHA-256',
    timestamp: new Date()
  }
}

/**
 * Verify hash with salt
 */
export async function verifyHashWithSalt(
  data: string,
  hashWithSalt: string
): Promise<boolean> {
  const [hash, salt] = hashWithSalt.split(':')
  if (!salt) return false

  const result = await sha256WithSalt(data, salt)
  return result.hash === hashWithSalt
}

/**
 * Convert ArrayBuffer to hex string
 */
export function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer)
  return Array.from(byteArray, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Convert hex string to ArrayBuffer
 */
export function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes.buffer
}

/**
 * Convert string to base64
 */
export function stringToBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
}

/**
 * Convert base64 to string
 */
export function base64ToString(base64: string): string {
  return decodeURIComponent(escape(atob(base64)))
}

/**
 * Generate random bytes as hex string
 */
export function generateRandomBytes(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return arrayBufferToHex(array.buffer)
}

/**
 * Hash object (serializes to JSON first)
 */
export async function hashObject(obj: any): Promise<string> {
  const jsonString = JSON.stringify(obj)
  return sha256(jsonString)
}

/**
 * Quick hash for non-cryptographic purposes (testing, etc)
 * Much faster than SHA-256 but NOT secure
 */
export function quickHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(16)
}
