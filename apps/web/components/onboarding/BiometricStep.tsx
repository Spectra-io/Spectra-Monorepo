'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Fingerprint, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface BiometricStepProps {
  onCapture: (biometricId: string) => void
}

export function BiometricStep({ onCapture }: BiometricStepProps) {
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [biometricId, setBiometricId] = useState<string | null>(null)

  async function handleRegister() {
    setRegistering(true)
    
    // Mock: Simular registro biométrico
    // En producción, aquí integrarías el componente de Karu: BiometricCapture
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockBiometricId = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
    
    setBiometricId(mockBiometricId)
    setRegistered(true)
    setRegistering(false)
    onCapture(mockBiometricId)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20"
        >
          <Fingerprint className="w-10 h-10 text-purple-400" />
        </motion.div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">
          Biometric Verification
        </h2>
        <p className="text-gray-400 text-lg">
          Register your biometric data for secure authentication
        </p>
      </div>

      {!registered ? (
        <div className="flex flex-col items-center space-y-6">
          <div className="w-48 h-48 border-2 border-purple-500/30 rounded-full flex items-center justify-center bg-purple-500/5 relative">
            <Fingerprint className="w-24 h-24 text-purple-400" />
            {registering && (
              <motion.div
                className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>
          <Button
            onClick={handleRegister}
            disabled={registering}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg font-medium"
          >
            {registering ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Registering...
              </>
            ) : (
              <>
                <Fingerprint className="w-5 h-5 mr-2" />
                Register Biometric
              </>
            )}
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 space-y-4"
        >
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold">Biometric Registered</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Biometric ID:</p>
            <p className="font-mono text-xs text-gray-300 break-all bg-gray-800/50 p-3 rounded">
              {biometricId?.substring(0, 32)}...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

