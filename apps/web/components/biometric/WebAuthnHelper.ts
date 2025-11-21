/**
 * WebAuthn Helper Functions
 * Biometric authentication using Web Authentication API
 */

import { startRegistration, startAuthentication } from '@simplewebauthn/browser'
import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON
} from '@simplewebauthn/types'
import { BiometricCredential } from './types'

/**
 * Check if WebAuthn is available in the browser
 */
export function isWebAuthnAvailable(): boolean {
  return !!(
    window?.PublicKeyCredential &&
    navigator?.credentials &&
    navigator.credentials.create
  )
}

/**
 * Detect available authenticator types
 */
export async function detectAuthenticatorType(): Promise<{
  available: boolean
  types: string[]
}> {
  if (!isWebAuthnAvailable()) {
    return { available: false, types: [] }
  }

  const types: string[] = []

  try {
    // Check for platform authenticator (Touch ID, Face ID, Windows Hello)
    if (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
      types.push('platform')
    }
  } catch (error) {
    console.warn('Error detecting authenticator:', error)
  }

  return {
    available: types.length > 0,
    types
  }
}

/**
 * Register new biometric credential
 * @param userId - Unique user ID (e.g., hashed DNI)
 * @param userName - User's display name
 * @returns Registered credential
 */
export async function registerBiometric(
  userId: string,
  userName: string
): Promise<BiometricCredential> {
  try {
    // Verify WebAuthn availability
    if (!isWebAuthnAvailable()) {
      throw new Error('WebAuthn is not available in this browser')
    }

    // Generate registration options
    // In production, these would come from the server
    const options: PublicKeyCredentialCreationOptionsJSON = {
      challenge: generateChallenge(),
      rp: {
        name: 'ZK Identity Stellar',
        id: window.location.hostname,
      },
      user: {
        id: userId,
        name: userName,
        displayName: userName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },   // ES256 (ECDSA)
        { alg: -257, type: 'public-key' }, // RS256 (RSA)
      ],
      timeout: 60000,
      attestation: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Only built-in authenticators
        requireResidentKey: false,
        userVerification: 'required', // Requires biometric
      },
    }

    // Start registration
    const credential = await startRegistration(options as any)

    // Process response
    const credentialId = credential.id
    const publicKey = credential.response.publicKey || ''

    return {
      id: credentialId,
      publicKey,
      credentialId: hexToArrayBuffer(credentialId),
      algorithm: 'ES256'
    }
  } catch (error: any) {
    // Handle specific errors
    if (error.name === 'NotAllowedError') {
      throw new Error('Registration cancelled by user')
    } else if (error.name === 'NotSupportedError') {
      throw new Error('Biometric authentication not supported on this device')
    } else {
      throw new Error('Biometric registration error: ' + error.message)
    }
  }
}

/**
 * Verify existing biometric credential
 * @param credentialId - Credential ID to verify
 * @returns True if verified successfully
 */
export async function verifyBiometric(
  credentialId: string
): Promise<boolean> {
  try {
    const options = {
      challenge: generateChallenge(),
      rpId: window.location.hostname,
      allowCredentials: [{
        id: credentialId,
        type: 'public-key' as const,
        transports: ['internal'] as AuthenticatorTransport[]
      }],
      userVerification: 'required' as UserVerificationRequirement,
      timeout: 60000
    }

    await startAuthentication(options as any)
    return true
  } catch (error) {
    console.error('Verification error:', error)
    return false
  }
}

/**
 * Generate random challenge for WebAuthn
 * In production, this should come from the server
 */
function generateChallenge(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Convert hex string to ArrayBuffer
 */
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes.buffer
}

/**
 * Convert ArrayBuffer to hex string
 */
export function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer)
  return Array.from(byteArray, b => b.toString(16).padStart(2, '0')).join('')
}
