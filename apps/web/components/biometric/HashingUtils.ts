import type { HashResult } from './types'

/**
 * Genera hash SHA-256 de datos
 * @param data - Datos a hashear (string)
 * @returns Hash como hex string
 */
export async function sha256(data: string): Promise<string> {
  // Codificar string a bytes
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)

  // Generar hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)

  // Convertir a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

/**
 * Genera hash SHA-512 (más seguro, más largo)
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
 * Genera un identificador único combinando múltiples datos
 * @param dni - DNI del usuario
 * @param publicKey - Clave pública biométrica
 * @param timestamp - Timestamp de registro
 * @returns Hash único del usuario
 */
export async function generateUniqueIdentifier(
  dni: string,
  publicKey: string,
  timestamp: number = Date.now()
): Promise<string> {
  // Combinar datos para crear identificador único
  const combined = `${dni}:${publicKey}:${timestamp}`

  // Hashear la combinación
  const hash = await sha256(combined)

  return hash
}

/**
 * Genera un salt aleatorio para hashing
 */
export function generateSalt(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Hash con salt (más seguro)
 */
export async function sha256WithSalt(data: string, salt?: string): Promise<HashResult> {
  const usedSalt = salt || generateSalt()
  const combined = `${data}${usedSalt}`
  const hash = await sha256(combined)

  return {
    hash: `${hash}:${usedSalt}`, // Guardamos el salt junto con el hash
    algorithm: 'SHA-256',
    timestamp: new Date()
  }
}

/**
 * Verifica un hash con salt
 */
export async function verifyHashWithSalt(
  data: string,
  hashWithSalt: string
): Promise<boolean> {
  const [hash, salt] = hashWithSalt.split(':')
  const result = await sha256WithSalt(data, salt)
  return result.hash === hashWithSalt
}

/**
 * Convierte ArrayBuffer a hex string
 */
export function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer)
  return Array.from(byteArray, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Convierte hex string a ArrayBuffer
 */
export function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes.buffer
}