/**
 * Biometric Component Types
 */

export interface BiometricCredential {
  id: string
  publicKey: string
  credentialId: ArrayBuffer
  algorithm: string
}

export interface BiometricCaptureProps {
  userId: string
  userName: string
  onCapture: (biometricId: string, credential: BiometricCredential) => void
  onError?: (error: string) => void
  onCancel?: () => void
}

export interface BiometricState {
  isRegistering: boolean
  isVerifying: boolean
  registered: boolean
  biometricId: string | null
  error: string | null
}

export interface AuthenticatorInfo {
  available: boolean
  types: string[]
}

export interface HashResult {
  hash: string
  algorithm: string
  timestamp: Date
}
