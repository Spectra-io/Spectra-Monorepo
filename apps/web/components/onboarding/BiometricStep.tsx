'use client'

import BiometricCapture from '@/components/biometric/BiometricCapture'
import { useIdentityStore } from '@/store/useIdentityStore'

interface BiometricStepProps {
  onCapture: (biometricId: string) => void
}

export function BiometricStep({ onCapture }: BiometricStepProps) {
  const stellarPublicKey = useIdentityStore(state => state.stellarPublicKey)

  // Use stellar public key as userId if available, otherwise generate a temporary one
  const userId = stellarPublicKey || `temp_${Date.now()}`
  const userName = 'User' // Could be enhanced to use actual name from DNI data

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">
          Biometric Verification
        </h2>
        <p className="text-gray-400 text-lg">
          Register your biometric data for secure authentication
        </p>
      </div>

      <BiometricCapture
        userId={userId}
        userName={userName}
        onCapture={(biometricId, credential) => {
          console.log('Biometric registered:', { biometricId, credential })
          onCapture(biometricId)
        }}
        onError={(error) => {
          console.error('Biometric error:', error)
        }}
      />
    </div>
  )
}
