'use client'

import BiometricCapture from '@/components/biometric/BiometricCapture'
import type { BiometricCaptureProps } from '@/components/biometric/types'

interface BiometricStepProps {
  userId?: string | null
  userName?: string | null
  onCapture: (biometricId: string) => void
  onError?: (error: string) => void
  onCancel?: () => void
}

export function BiometricStep({ userId, userName, onCapture, onError, onCancel }: BiometricStepProps) {
  // Encapsula el componente real `BiometricCapture` y adapta la firma de onCapture
  const handleCapture: BiometricCaptureProps['onCapture'] = (biometricId, credential) => {
    // `BiometricCapture` pasa (id, credential) — aquí solo propagamos el id al padre
    onCapture(biometricId)
  }

  return (
    <div>
      <BiometricCapture
        userId={userId || ''}
        userName={userName || ''}
        onCapture={handleCapture}
        onError={onError}
        onCancel={onCancel}
      />
    </div>
  )
}

