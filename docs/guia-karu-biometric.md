# Guía Biometría & Hash - Karu

## 🎯 Contexto del Proyecto

### ¿Qué estamos construyendo?

**ZK Identity Stellar** es un sistema de identidad digital donde los usuarios hacen KYC una sola vez (foto DNI + huella biométrica) y luego generan pruebas criptográficas Zero Knowledge para demostrar atributos sin revelar datos personales.

### Tu Rol: Autenticación Biométrica

Eres la **guardiana de la autenticidad**. Tu componente asegura que la persona que usa la app es realmente quien dice ser. Sin biometría, cualquiera podría robar los datos del DNI y usarlos. Tu trabajo cierra esa vulnerabilidad.

## 👥 Equipo y Responsabilidades

### Tu Rol: Biometric & Hash (Karu)
**Responsabilidad**: Implementar captura biométrica (huella digital) con WebAuthn y generar identificadores únicos usando hashing

### Tus Compañeras:

1. **Angie** - Frontend
   - Integra TU componente en el flow de onboarding
   - Muestra loading states y feedback visual
   - Maneja errores de biometría
   - Archivos: `apps/web/app/`, `apps/web/components/`

2. **Denisse** - Database & Encryption
   - Encripta el ID biométrico que TÚ generas
   - Lo fragmenta junto con otros datos sensibles
   - Almacena de forma distribuida
   - Archivos: `packages/crypto/`

3. **Isa** - Componente de Cámara
   - Antes de tu componente, captura el DNI
   - Extrae datos del documento
   - Te pasa el DNI para que lo uses en el hash
   - Archivos: `apps/web/components/camera/`

4. **Anouk** - Zero Knowledge Circuits
   - Usa el hash biométrico para pruebas de identidad única
   - Demuestra "soy único" sin revelar la huella
   - Archivos: `packages/zk-circuits/`

## 👆 Tu Tarea: Biometric Capture & Hashing

### Objetivo Principal

Crear un sistema que:
1. Capture huella digital usando WebAuthn (estándar web)
2. Genere un identificador biométrico único
3. Cree hashes seguros (SHA-256) del DNI y datos sensibles
4. Retorne el ID biométrico para almacenamiento seguro

### ¿Qué es WebAuthn?

**WebAuthn** (Web Authentication API) es un estándar moderno del W3C que permite autenticación biométrica en navegadores web.

**Lo que puede hacer**:
- 👆 Huella digital (Touch ID, Windows Hello, etc.)
- 😊 Reconocimiento facial (Face ID)
- 🔑 Llaves de seguridad físicas (YubiKey)

**Ventajas**:
- ✅ Funciona nativamente en el browser (no necesitas apps)
- ✅ No almacena la huella en el servidor (solo un ID público)
- ✅ Muy seguro (resistente a phishing)
- ✅ Soportado en la mayoría de dispositivos modernos

### Archivos Donde Trabajar

```
apps/web/components/biometric/
├── BiometricCapture.tsx        ⭐ Componente principal
├── WebAuthnHelper.ts           ⭐ Lógica WebAuthn
├── HashingUtils.ts             ⭐ Funciones de hash
└── types.ts                    ⭐ TypeScript types
```

### Stack Tecnológico que Ya Tienes

**WebAuthn**:
- ✅ `@simplewebauthn/browser` (ya instalada)
  - Simplifica el uso de WebAuthn
  - Cross-browser compatible
- ✅ `@simplewebauthn/server` (ya instalada)
  - Para verificación server-side

**Hashing**:
- ✅ SubtleCrypto API (nativo del browser)
  - SHA-256, SHA-512
  - No necesita librerías externas

## 🔐 Implementación Paso a Paso

### Paso 1: Tipos TypeScript

**Archivo**: `apps/web/components/biometric/types.ts`

```typescript
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
```

### Paso 2: Utilidades de Hashing

**Archivo**: `apps/web/components/biometric/HashingUtils.ts`

```typescript
/**
 * Genera hash SHA-256 de datos
 * @param data - Datos a hashear (string)
 * @returns Hash como hex string
 */
export async function sha256(data: string): Promise<string> {
  // Codificar string a bytes
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)

  // Generar hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)

  // Convertir a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

/**
 * Genera hash SHA-512 (más seguro, más largo)
 */
export async function sha512(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-512', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

/**
 * Genera un identificador único combinando múltiples datos
 * @param dni - DNI del usuario
 * @param publicKey - Clave pública biométrica
 * @param timestamp - Timestamp de registro
 * @returns Hash único del usuario
 */
export async function generateUniqueIdentifier(
  dni: string,
  publicKey: string,
  timestamp: number = Date.now()
): Promise<string> {
  // Combinar datos para crear identificador único
  const combined = `${dni}:${publicKey}:${timestamp}`

  // Hashear la combinación
  const hash = await sha256(combined)

  return hash
}

/**
 * Genera un salt aleatorio para hashing
 */
export function generateSalt(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Hash con salt (más seguro)
 */
export async function sha256WithSalt(data: string, salt?: string): Promise<HashResult> {
  const usedSalt = salt || generateSalt()
  const combined = `${data}${usedSalt}`
  const hash = await sha256(combined)

  return {
    hash: `${hash}:${usedSalt}`, // Guardamos el salt junto con el hash
    algorithm: 'SHA-256',
    timestamp: new Date()
  }
}

/**
 * Verifica un hash con salt
 */
export async function verifyHashWithSalt(
  data: string,
  hashWithSalt: string
): Promise<boolean> {
  const [hash, salt] = hashWithSalt.split(':')
  const result = await sha256WithSalt(data, salt)
  return result.hash === hashWithSalt
}

/**
 * Convierte ArrayBuffer a hex string
 */
export function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer)
  return Array.from(byteArray, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Convierte hex string a ArrayBuffer
 */
export function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes.buffer
}
```

### Paso 3: WebAuthn Helper

**Archivo**: `apps/web/components/biometric/WebAuthnHelper.ts`

```typescript
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
    const credential = await startRegistration(options)

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
```

### Paso 4: Componente Principal

**Archivo**: `apps/web/components/biometric/BiometricCapture.tsx`

```typescript
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
```

### Paso 5: Componente de Verificación (Opcional)

Para verificar la biometría en logins futuros:

**Archivo**: `apps/web/components/biometric/BiometricVerification.tsx`

```typescript
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { verifyBiometric } from './WebAuthnHelper'
import { Fingerprint, Loader2, Check, X } from 'lucide-react'

interface BiometricVerificationProps {
  credentialId: string
  onSuccess: () => void
  onFail: () => void
}

export function BiometricVerification({
  credentialId,
  onSuccess,
  onFail
}: BiometricVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<'success' | 'fail' | null>(null)

  const handleVerify = async () => {
    setIsVerifying(true)

    try {
      const verified = await verifyBiometric(credentialId)

      if (verified) {
        setResult('success')
        setTimeout(onSuccess, 1000)
      } else {
        setResult('fail')
        setTimeout(onFail, 2000)
      }
    } catch (error) {
      setResult('fail')
      setTimeout(onFail, 2000)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="text-center p-6">
      {!result && (
        <>
          <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {isVerifying ? (
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            ) : (
              <Fingerprint className="w-12 h-12 text-blue-600" />
            )}
          </div>

          <h3 className="text-lg font-semibold mb-2">
            {isVerifying ? 'Verificando...' : 'Verifica tu identidad'}
          </h3>

          {!isVerifying && (
            <Button onClick={handleVerify} size="lg">
              <Fingerprint className="w-5 h-5 mr-2" />
              Autenticar
            </Button>
          )}
        </>
      )}

      {result === 'success' && (
        <div>
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <p className="text-green-800 font-medium">Verificación exitosa</p>
        </div>
      )}

      {result === 'fail' && (
        <div>
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <X className="w-12 h-12 text-red-600" />
          </div>
          <p className="text-red-800 font-medium">Verificación fallida</p>
        </div>
      )}
    </div>
  )
}
```

### Cómo Integrar con el Trabajo de Tus Compañeras

#### Con Angie (Frontend):
```typescript
// En apps/web/app/onboarding/page.tsx
import BiometricCapture from '@/components/biometric/BiometricCapture'

<BiometricCapture
  userId={dniData.dni} // DNI del paso anterior (Isa)
  userName={`${dniData.nombre} ${dniData.apellido}`}
  onCapture={(biometricId, credential) => {
    // Guardar en Zustand store
    setBiometricId(biometricId)

    // Pasar al siguiente paso
    setStep(4)
  }}
  onError={(error) => {
    toast.error(error)
  }}
/>
```

#### Con Denisse (Encryption):
```typescript
// Denisse encriptará el ID biométrico
import { protectUserData } from '@zk-identity/crypto'

const biometricData = {
  biometricId,
  credentialId: credential.id,
  publicKey: credential.publicKey
}

await protectUserData(biometricData, userId, stellarPublicKey)
```

#### Con Anouk (ZK Circuits):
```typescript
// El hash biométrico se usa en pruebas de identidad única
import { generateIdentityProof } from '@zk-identity/zk-circuits'

const identityProof = await generateIdentityProof(biometricId)
// Esta prueba demuestra que eres único sin revelar tu huella
```

### Cómo Probar Tu Componente

#### Test 1: Verificar Disponibilidad

```typescript
// En consola del browser
import { isWebAuthnAvailable, detectAuthenticatorType } from './WebAuthnHelper'

console.log('WebAuthn disponible:', isWebAuthnAvailable())

const info = await detectAuthenticatorType()
console.log('Autenticadores:', info)
```

#### Test 2: Página de Prueba

```typescript
// apps/web/app/test-biometric/page.tsx
'use client'
import BiometricCapture from '@/components/biometric/BiometricCapture'

export default function TestBiometricPage() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Test Componente Biométrico</h1>
      <BiometricCapture
        userId="test_user_123"
        userName="Usuario de Prueba"
        onCapture={(bioId, cred) => {
          console.log('✅ Biometric ID:', bioId)
          console.log('Credential:', cred)
          alert('Registro exitoso!')
        }}
        onError={(error) => alert('Error: ' + error)}
      />
    </div>
  )
}
```

#### Test 3: Hashing

```typescript
import { sha256, generateUniqueIdentifier, sha256WithSalt } from './HashingUtils'

// Test hash simple
const hash = await sha256('mi_texto_secreto')
console.log('Hash SHA-256:', hash)

// Test hash con salt
const result = await sha256WithSalt('password123')
console.log('Hash con salt:', result.hash)

// Test identificador único
const id = await generateUniqueIdentifier('12345678', 'publickey123')
console.log('ID único:', id)
```

### Soporte de Dispositivos

**✅ Soportado**:
- iPhone con Touch ID / Face ID (Safari, Chrome)
- Android con huella digital (Chrome, Firefox)
- Mac con Touch ID (Safari, Chrome, Firefox)
- Windows con Windows Hello (Chrome, Edge, Firefox)

**❌ No soportado**:
- Dispositivos antiguos sin biometría
- Browsers muy antiguos

### Fallback para Dispositivos sin Biometría

Si el dispositivo no tiene biometría, puedes implementar un fallback:

```typescript
// Alternativa: PIN de 6 dígitos
export function PINFallback({ onComplete }: { onComplete: (pin: string) => void }) {
  const [pin, setPin] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pin.length === 6) {
      // Hashear el PIN
      const pinHash = await sha256(pin + 'salt_secret')
      onComplete(pinHash)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        inputMode="numeric"
        pattern="[0-9]{6}"
        maxLength={6}
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Ingresa PIN de 6 dígitos"
      />
      <Button type="submit" disabled={pin.length !== 6}>
        Confirmar
      </Button>
    </form>
  )
}
```

### Checklist de Tareas

**WebAuthn**:
- [ ] Implementar `isWebAuthnAvailable()`
- [ ] Implementar `detectAuthenticatorType()`
- [ ] Implementar `registerBiometric()`
- [ ] Implementar `verifyBiometric()`
- [ ] Manejar errores específicos de WebAuthn

**Hashing**:
- [ ] Implementar `sha256()`
- [ ] Implementar `sha512()` (opcional)
- [ ] Implementar `generateUniqueIdentifier()`
- [ ] Implementar `sha256WithSalt()`
- [ ] Implementar `verifyHashWithSalt()`

**Componente UI**:
- [ ] Renderizado inicial
- [ ] Loading state durante registro
- [ ] Success state con ID generado
- [ ] Error handling y mensajes claros
- [ ] Botón de cancelar

**Testing**:
- [ ] Probado en iPhone (Touch ID / Face ID)
- [ ] Probado en Android (Huella)
- [ ] Probado en desktop (opcional)
- [ ] Manejo de cancelación del usuario
- [ ] Fallback para dispositivos sin biometría

### Recursos y Referencias

**WebAuthn**:
- [WebAuthn Guide](https://webauthn.guide/)
- [MDN Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
- [SimpleWebAuthn Docs](https://simplewebauthn.dev/)

**Hashing**:
- [SubtleCrypto API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
- [SHA-256 Explained](https://en.wikipedia.org/wiki/SHA-2)

**Seguridad**:
- [FIDO Alliance](https://fidoalliance.org/)
- [WebAuthn Security](https://www.w3.org/TR/webauthn-2/#sctn-security-considerations)

### Consejos Finales

1. **Testing en dispositivos reales**: WebAuthn funciona diferente en móvil vs desktop
2. **Mensajes claros**: Explica al usuario qué está pasando en cada paso
3. **Error handling robusto**: Los usuarios pueden cancelar, manejar eso gracefully
4. **Seguridad primero**: Nunca loguees hashes o IDs sensibles
5. **Fallbacks**: Siempre ten un plan B para dispositivos sin biometría

### Debugging Tips

**Si WebAuthn no funciona**:
- Verifica que estés en HTTPS (o localhost)
- Chequea que el browser lo soporte
- Revisa permisos de biometría en el sistema operativo

**Si el hash no coincide**:
- Verifica que uses el mismo algoritmo
- Chequea que el salt sea el mismo
- Asegúrate de que el encoding sea consistente (UTF-8)

**Si la biometría se cancela**:
- Es normal, el usuario puede cancelar
- Muestra un mensaje amigable
- Permite reintentar

¡Mucha suerte Karu! Tu componente es la clave de la autenticidad. ¡Hazlo seguro y fácil de usar! 👆🔐✨
