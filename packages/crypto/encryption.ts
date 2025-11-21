/**
 * AES-256-GCM Encryption
 * Secure encryption for sensitive data
 */

/**
 * Generate a secure random encryption key (256 bits = 32 bytes)
 * @returns Hex string representation of the key
 */
export function generateEncryptionKey(): string {
  const keyArray = new Uint8Array(32) // 256 bits
  crypto.getRandomValues(keyArray)
  return bufferToHex(keyArray)
}

/**
 * Encrypt data using AES-256-GCM
 * @param data - Data to encrypt (string)
 * @param keyHex - Encryption key as hex string (64 characters)
 * @returns Encrypted data with IV and auth tag
 */
export async function encryptData(
  data: string,
  keyHex: string
): Promise<{
  encryptedData: string
  iv: string
  authTag: string
}> {
  try {
    // Convert hex key to buffer
    const keyBuffer = hexToBuffer(keyHex)

    // Generate random IV (Initialization Vector) - 12 bytes for GCM
    const iv = new Uint8Array(12)
    crypto.getRandomValues(iv)

    // Import key for Web Crypto API
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    )

    // Encode data to bytes
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)

    // Encrypt
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128 // 128-bit authentication tag
      },
      cryptoKey,
      dataBuffer
    )

    // The encrypted buffer contains both ciphertext and auth tag
    const encryptedArray = new Uint8Array(encryptedBuffer)

    // Last 16 bytes are the auth tag
    const authTag = encryptedArray.slice(-16)
    const ciphertext = encryptedArray.slice(0, -16)

    return {
      encryptedData: bufferToHex(ciphertext),
      iv: bufferToHex(iv),
      authTag: bufferToHex(authTag)
    }
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedDataHex - Encrypted data as hex string
 * @param keyHex - Encryption key as hex string
 * @param ivHex - IV as hex string
 * @param authTagHex - Auth tag as hex string
 * @returns Decrypted data as string
 */
export async function decryptData(
  encryptedDataHex: string,
  keyHex: string,
  ivHex: string,
  authTagHex: string
): Promise<string> {
  try {
    // Convert hex to buffers
    const keyBuffer = hexToBuffer(keyHex)
    const ivBuffer = hexToBuffer(ivHex)
    const encryptedBuffer = hexToBuffer(encryptedDataHex)
    const authTagBuffer = hexToBuffer(authTagHex)

    // Combine ciphertext and auth tag
    const combined = new Uint8Array(encryptedBuffer.length + authTagBuffer.length)
    combined.set(new Uint8Array(encryptedBuffer), 0)
    combined.set(new Uint8Array(authTagBuffer), encryptedBuffer.length)

    // Import key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    )

    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer,
        tagLength: 128
      },
      cryptoKey,
      combined
    )

    // Decode to string
    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Hash data using SHA-256
 * @param data - Data to hash
 * @returns Hash as hex string
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  return bufferToHex(new Uint8Array(hashBuffer))
}

/**
 * Convert buffer to hex string
 */
function bufferToHex(buffer: Uint8Array | ArrayBuffer): string {
  const byteArray = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  return Array.from(byteArray, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Convert hex string to Uint8Array
 */
function hexToBuffer(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string length')
  }

  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}

/**
 * Generate random key as base64 (alternative format)
 */
export function generateRandomKeyBase64(): string {
  const keyArray = new Uint8Array(32)
  crypto.getRandomValues(keyArray)
  return btoa(String.fromCharCode(...keyArray))
}
