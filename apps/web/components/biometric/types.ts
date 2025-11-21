export interface BiometricCredential {
  id: string                    // ID único de la credencial
  publicKey: string             // Clave pública (para verificación)
  credentialId: ArrayBuffer     // ID en formato raw
  algorithm: string             // Algoritmo usado (e.g., 'ES256')
}

export interface BiometricCaptureProps {
  userId: string                // ID del usuario (del DNI)
  userName: string              // Nombre para mostrar
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

export interface HashResult {
  hash: string                  // Hash hex string
  algorithm: 'SHA-256' | 'SHA-512'
  timestamp: Date
}