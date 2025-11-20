// Mock DNI Data Types
export interface MockDNIData {
  nombre: string
  apellido: string
  dni: string
  fechaNacimiento: string
  nacionalidad: 'Argentina'
}

// ZK Proof Types
export interface ZKProof {
  id: string
  type: 'age' | 'nationality' | 'identity'
  proofHash: string
  publicSignals: string[]
  createdAt: Date
}

// Encrypted Fragment Types
export interface EncryptedFragment {
  index: number
  data: string
  location: 'local' | 'stellar' | 'ipfs' | 'supabase' | 'redis'
}

// User Identity Types
export interface UserIdentity {
  id: string
  stellarPublicKey: string
  biometricId: string
  kycCompleted: boolean
  proofs: ZKProof[]
  createdAt: Date
  updatedAt: Date
}

// Biometric Types
export interface BiometricCredential {
  id: string
  publicKey: string
  credentialId: ArrayBuffer
  algorithm: string
}

// Stellar Account Types
export interface StellarAccountData {
  publicKey: string
  accountId: string
  balance: string
  dataEntries: Record<string, string>
}
