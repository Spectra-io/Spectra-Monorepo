import { create } from 'zustand'

interface IdentityState {
  // User data
  stellarPublicKey: string | null
  biometricId: string | null

  // KYC status
  kycCompleted: boolean
  kycStep: 'idle' | 'document' | 'biometric' | 'zk-generation' | 'completed'

  // ZK Proofs
  proofs: {
    age?: string
    nationality?: string
    identity?: string
  }

  // Actions
  setStellarPublicKey: (key: string) => void
  setBiometricId: (id: string) => void
  setKycStep: (step: IdentityState['kycStep']) => void
  setProof: (type: 'age' | 'nationality' | 'identity', proof: string) => void
  completeKyc: () => void
  reset: () => void
}

export const useIdentityStore = create<IdentityState>((set) => ({
  // Initial state
  stellarPublicKey: null,
  biometricId: null,
  kycCompleted: false,
  kycStep: 'idle',
  proofs: {},

  // Actions
  setStellarPublicKey: (key) => set({ stellarPublicKey: key }),
  setBiometricId: (id) => set({ biometricId: id }),
  setKycStep: (step) => set({ kycStep: step }),
  setProof: (type, proof) =>
    set((state) => ({
      proofs: { ...state.proofs, [type]: proof }
    })),
  completeKyc: () =>
    set({ kycCompleted: true, kycStep: 'completed' }),
  reset: () =>
    set({
      stellarPublicKey: null,
      biometricId: null,
      kycCompleted: false,
      kycStep: 'idle',
      proofs: {},
    }),
}))
