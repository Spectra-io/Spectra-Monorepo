'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  isWebAuthnAvailable,
  detectAuthenticatorType,
  registerBiometric
} from './WebAuthnHelper'
import { generateUniqueIdentifier, sha256 } from './HashingUtils'
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

  // Verificar disponibilidad al montar
  useEffect(() => {
    checkAvailability()
  }, [])

  const checkAvailability = async () => {
    const info = await detectAuthenticatorType()
    setAuthenticatorInfo(info)

    if (!info.available) {
      setState(prev => ({
        ...prev,
        error: 'Este dispositivo no tiene autenticación biométrica disponible'
      }))
      onError?.('Biometría no disponible')
    }
  }

  // Iniciar registro biométrico
  const handleRegister = async () => {
    setState(prev => ({ ...prev, isRegistering: true, error: null }))

    try {
      // 1. Registrar credencial biométrica
      const credential = await registerBiometric(userId, userName)

      // 2. Generar ID biométrico único
      const biometricId = await generateUniqueIdentifier(
        userId,
        credential.publicKey,
        Date.now()
      )

      // 3. Hashear para mayor seguridad
      const biometricIdHash = await sha256(biometricId)

      // 4. Actualizar estado
      setState(prev => ({
        ...prev,
        isRegistering: false,
        registered: true,
        biometricId: biometricIdHash
      }))

      // 5. Notificar al padre
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

  // Si no hay soporte, mostrar error
  if (!isWebAuthnAvailable()) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Biometría No Disponible
            </h3>
            <p className="text-gray-600 mb-4">
              Tu navegador no soporta autenticación biométrica.
              Por favor usa un navegador moderno (Chrome, Firefox, Safari).
            </p>
            {onCancel && (
              <Button onClick={onCancel} variant="outline">
                Volver
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="w-6 h-6" />
          Registro Biométrico
        </CardTitle>
        <p className="text-sm text-gray-600">
          Registra tu huella digital o reconocimiento facial para proteger tu identidad
        </p>
      </CardHeader>

      <CardContent>
        {/* Estado: Sin registrar */}
        {!state.registered && !state.isRegistering && (
          <div className="text-center py-8">
            {/* Icono de huella */}
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Fingerprint className="w-20 h-20 text-blue-600" />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Protege tu Identidad
            </h3>

            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Usaremos {authenticatorInfo.types.includes('platform') ? 'la biometría de tu dispositivo' : 'autenticación segura'}
              {' '}para crear un identificador único que nadie más puede replicar.
            </p>

            {/* Información de seguridad */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                ¿Es seguro?
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Tu huella nunca sale de tu dispositivo</li>
                <li>✓ Solo se genera un ID único encriptado</li>
                <li>✓ Imposible de replicar o robar</li>
              </ul>
            </div>

            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left max-w-md mx-auto">
                <p className="text-sm text-red-800">{state.error}</p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              {onCancel && (
                <Button onClick={onCancel} variant="outline">
                  Cancelar
                </Button>
              )}
              <Button onClick={handleRegister} size="lg">
                <Fingerprint className="w-5 h-5 mr-2" />
                Registrar Biometría
              </Button>
            </div>
          </div>
        )}

        {/* Estado: Registrando */}
        {state.isRegistering && (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Esperando autenticación...
            </h3>
            <p className="text-gray-600">
              Por favor, completa la autenticación en tu dispositivo
            </p>
          </div>
        )}

        {/* Estado: Registrado exitosamente */}
        {state.registered && state.biometricId && (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-20 h-20 text-green-600" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-green-800 mb-3">
              ✓ Biometría Registrada
            </h3>

            <p className="text-gray-600 mb-6">
              Tu identidad biométrica ha sido registrada exitosamente
            </p>

            {/* Mostrar ID (primeros caracteres) */}
            <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto mb-6">
              <p className="text-xs text-gray-600 mb-1">ID Biométrico:</p>
              <code className="text-xs font-mono text-gray-800">
                {state.biometricId.substring(0, 16)}...
              </code>
            </div>

            <p className="text-sm text-gray-500">
              Continuando al siguiente paso...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}