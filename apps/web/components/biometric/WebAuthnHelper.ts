import { startRegistration, startAuthentication } from '@simplewebauthn/browser'
import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON
} from '@simplewebauthn/types'
import { BiometricCredential } from './types'
import { arrayBufferToHex } from './HashingUtils'

/**
 * Verifica si WebAuthn está disponible en el navegador
 */
export function isWebAuthnAvailable(): boolean {
  return !!(
    window?.PublicKeyCredential &&
    navigator?.credentials &&
    navigator.credentials.create
  )
}

/**
 * Detecta qué tipo de autenticador está disponible
 */
export async function detectAuthenticatorType(): Promise<{
  available: boolean
  types: string[]
}> {
  if (!isWebAuthnAvailable()) {
    return { available: false, types: [] }
  }

  const types: string[] = []

  // Verificar plataforma (Touch ID, Face ID, Windows Hello)
  if (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
    types.push('platform') // Biometría integrada
  }

  return {
    available: types.length > 0,
    types
  }
}

/**
 * Registra una nueva credencial biométrica
 * @param userId - ID único del usuario (puede ser el DNI hasheado)
 * @param userName - Nombre para mostrar
 * @returns Credencial registrada
 */
export async function registerBiometric(
  userId: string,
  userName: string
): Promise<BiometricCredential> {
  try {
    // Verificar disponibilidad
    if (!isWebAuthnAvailable()) {
      throw new Error('WebAuthn no está disponible en este navegador')
    }

    // Generar opciones de registro
    // En producción, estas vendrían del servidor
    const options: PublicKeyCredentialCreationOptionsJSON = {
      challenge: generateChallenge(),
      rp: {
        name: 'ZK Identity Stellar',
        id: window.location.hostname, // e.g., 'localhost' or 'zkidentity.com'
      },
      user: {
        id: userId,
        name: userName,
        displayName: userName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },  // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      timeout: 60000, // 60 segundos
      attestation: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Solo autenticadores integrados
        requireResidentKey: false,
        userVerification: 'required', // Requiere biometría
      },
    }

    // Iniciar registro
    const credential = await startRegistration(options as any)

    // Procesar respuesta
    const credentialId = credential.id
    const publicKey = credential.response.publicKey || ''

    return {
      id: credentialId,
      publicKey,
      credentialId: hexToArrayBuffer(credentialId),
      algorithm: 'ES256'
    }
  } catch (error: any) {
    // Manejar errores específicos
    if (error.name === 'NotAllowedError') {
      throw new Error('Registro cancelado por el usuario')
    } else if (error.name === 'NotSupportedError') {
      throw new Error('Biometría no soportada en este dispositivo')
    } else {
      throw new Error('Error en registro biométrico: ' + error.message)
    }
  }
}

/**
 * Verifica una credencial biométrica existente
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

    await startAuthentication(options)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Genera un challenge aleatorio para WebAuthn
 * En producción, este vendría del servidor
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
 * Convierte hex string a ArrayBuffer
 */
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes.buffer
}