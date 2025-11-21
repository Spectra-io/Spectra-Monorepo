'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  isWebAuthnAvailable,
  detectAuthenticatorType,
  registerBiometric
} from './WebAuthnHelper'
import { generateUniqueIdentifier, sha256 } from '@/lib/HashingUtils'
import { BiometricCaptureProps, BiometricState, BiometricCredential } from './types'
import { Fingerprint, Loader2, Check, AlertTriangle, Smartphone } from 'lucide-react'

export default function BiometricCapture({
  userId,
  userName,
  onCapture,
  onError,
  onCancel
}: BiometricCaptureProps) {
  const [state, setState] = useState<BiometricState>({
    isRegistering: false,
    isVerifying: false,
    registered: false,
    biometricId: null,
    error: null
  })

  const [authenticatorInfo, setAuthenticatorInfo] = useState<{
    available: boolean
    types: string[]
  }>({ available: false, types: [] })

  // Check availability on mount
  useEffect(() => {
    checkAvailability()
  }, [])

  const checkAvailability = async () => {
    const info = await detectAuthenticatorType()
    setAuthenticatorInfo(info)

    if (!info.available) {
      setState(prev => ({
        ...prev,
        error: 'This device does not have biometric authentication available'
      }))
      onError?.('Biometric authentication not available')
    }
  }

  // Start biometric registration
  const handleRegister = async () => {
    setState(prev => ({ ...prev, isRegistering: true, error: null }))

    try {
      // 1. Register biometric credential
      const credential = await registerBiometric(userId, userName)

      // 2. Generate unique biometric ID
      const biometricId = await generateUniqueIdentifier(
        userId,
        credential.publicKey,
        Date.now()
      )

      // 3. Hash for additional security
      const biometricIdHash = await sha256(biometricId)

      // 4. Update state
      setState(prev => ({
        ...prev,
        isRegistering: false,
        registered: true,
        biometricId: biometricIdHash
      }))

      // 5. Notify parent
      onCapture(biometricIdHash, credential)

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isRegistering: false,
        error: error.message
      }))
      onError?.(error.message)
    }
  }

  // If WebAuthn not supported
  if (!isWebAuthnAvailable()) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="py-12">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-100">
              Biometric Authentication Not Available
            </h3>
            <p className="text-gray-400 mb-4">
              Your browser does not support biometric authentication.
              Please use a modern browser (Chrome, Firefox, Safari).
            </p>
            {onCancel && (
              <Button onClick={onCancel} variant="outline" className="border-gray-700">
                Go Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-100">
          <Fingerprint className="w-6 h-6" />
          Biometric Registration
        </CardTitle>
        <p className="text-sm text-gray-400">
          Register your fingerprint or facial recognition to protect your identity
        </p>
      </CardHeader>

      <CardContent>
        {/* State: Not registered */}
        {!state.registered && !state.isRegistering && (
          <div className="text-center py-8">
            {/* Fingerprint Icon */}
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-purple-900/20 rounded-full flex items-center justify-center border-2 border-purple-500/30">
                <Fingerprint className="w-20 h-20 text-purple-400" />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-gray-100">
              Protect Your Identity
            </h3>

            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              We will use {authenticatorInfo.types.includes('platform') ? 'your device biometric authentication' : 'secure authentication'}
              {' '}to create a unique identifier that only you can access.
            </p>

            {/* Security Information */}
            <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <h4 className="font-medium text-purple-300 mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Is it secure?
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>✓ Your biometric data never leaves your device</li>
                <li>✓ Only a unique encrypted ID is generated</li>
                <li>✓ Impossible to replicate or steal</li>
              </ul>
            </div>

            {state.error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4 text-left max-w-md mx-auto">
                <p className="text-sm text-red-300">{state.error}</p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              {onCancel && (
                <Button onClick={onCancel} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Cancel
                </Button>
              )}
              <Button onClick={handleRegister} size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Fingerprint className="w-5 h-5 mr-2" />
                Register Biometric
              </Button>
            </div>
          </div>
        )}

        {/* State: Registering */}
        {state.isRegistering && (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 mx-auto text-purple-500 animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-100">
              Waiting for authentication...
            </h3>
            <p className="text-gray-400">
              Please complete the authentication on your device
            </p>
          </div>
        )}

        {/* State: Registered successfully */}
        {state.registered && state.biometricId && (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-green-900/20 rounded-full flex items-center justify-center border-2 border-green-500/30">
                <Check className="w-20 h-20 text-green-400" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-green-400 mb-3">
              ✓ Biometric Registered
            </h3>

            <p className="text-gray-400 mb-6">
              Your biometric identity has been registered successfully
            </p>

            {/* Show ID (first characters) */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-w-md mx-auto mb-6">
              <p className="text-xs text-gray-500 mb-1">Biometric ID:</p>
              <code className="text-xs font-mono text-gray-300">
                {state.biometricId.substring(0, 16)}...
              </code>
            </div>

            <p className="text-sm text-gray-500">
              Continuing to next step...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
