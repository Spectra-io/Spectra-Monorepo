# Guía Frontend - Angie

## 🎯 Contexto del Proyecto

### ¿Qué estamos construyendo?

**ZK Identity Stellar** es un sistema de identidad digital con Zero Knowledge Proofs para Stellar Network. El objetivo es permitir que los usuarios hagan KYC (Know Your Customer) **una sola vez** y luego puedan generar pruebas criptográficas que demuestren cosas como "soy mayor de edad", "soy argentino" o "tengo un DNI único" **sin revelar sus datos personales**.

### El Problema que Resolvemos

Actualmente, cada anchor (exchange, banco, etc.) en Stellar requiere que hagas KYC desde cero. Esto significa:
- Subir tu DNI múltiples veces
- Dar tus datos personales a múltiples empresas
- Riesgo de privacidad (tus datos están en muchos lugares)
- Proceso lento y repetitivo

### Nuestra Solución

1. **KYC Una Vez**: El usuario captura su DNI + huella biométrica una sola vez
2. **Pruebas ZK**: Generamos pruebas criptográficas que demuestran atributos sin revelar datos
3. **Privacy-First**: Los datos se encriptan y fragmentan (Shamir Secret Sharing)
4. **Reutilizable**: Las pruebas ZK se pueden usar con cualquier anchor de Stellar

## 👥 Equipo y Responsabilidades

### Tu Rol: Frontend Developer (Angie)
**Responsabilidad**: Crear toda la interfaz de usuario y experiencia mobile-first

### Tus Compañeras:

1. **Denisse** - Base de Datos & Threshold Encryption
   - Implementa Shamir Secret Sharing (fragmentación de datos)
   - Maneja la encriptación AES-256-GCM
   - Distribuye fragmentos en 5 ubicaciones diferentes
   - Archivos: `packages/crypto/`

2. **Isa** - Componente de Cámara
   - Captura de foto del DNI
   - Detección de bordes del documento
   - Mock OCR para extraer datos
   - Archivos: `apps/web/components/camera/`

3. **Karu** - Biometría & Hash
   - Implementa WebAuthn para huella digital
   - Genera identificadores únicos biométricos
   - Hashing con SHA-256
   - Archivos: `apps/web/components/biometric/`

4. **Anouk** - Zero Knowledge Circuits
   - Escribe circuitos en Circom (age, nationality, identity)
   - Integra SnarkJS para generar pruebas
   - Verifica pruebas
   - Archivos: `packages/zk-circuits/`

## 🎨 Tu Tarea: Frontend UI/UX

### Objetivo Principal
Crear una **Progressive Web App (PWA) mobile-first** hermosa, intuitiva y moderna que guíe a los usuarios a través del proceso de KYC y generación de pruebas ZK.

### Páginas a Implementar

#### 1. Home Page (`apps/web/app/page.tsx`)
**Estado actual**: Página básica con 2 botones

**Lo que necesitas hacer**:
- ✅ Diseño hero section atractivo
- ✅ Explicar brevemente qué es ZK Identity
- ✅ Call-to-action claro para comenzar KYC
- ✅ Animaciones suaves (usar Framer Motion)
- ✅ Iconos con Lucide React
- ✅ Diseño responsive mobile-first

**Ejemplo de estructura**:
```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-gray-900">
            Identidad Digital Privada
          </h1>
          <p className="text-xl text-gray-600 mt-4">
            KYC una vez. Prueba infinitas veces. Sin revelar tus datos.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {/* Feature cards */}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button size="lg" onClick={() => router.push('/onboarding')}>
            Comenzar KYC
          </Button>
        </div>
      </section>
    </main>
  )
}
```

#### 2. Onboarding Flow (`apps/web/app/onboarding/page.tsx`)
**Estado actual**: Placeholder simple

**Lo que necesitas implementar**:

**Paso 1: Conectar Wallet Stellar**
- Botón para conectar Freighter Wallet
- Mostrar dirección pública conectada
- Validación de conexión

**Paso 2: Captura de Documento**
- Integrar el componente de cámara de Isa
- Mostrar preview de la foto
- Botón para continuar
- Mostrar datos extraídos del DNI (mock)

**Paso 3: Captura Biométrica**
- Integrar componente de huella de Karu
- Mostrar confirmación de registro exitoso
- Feedback visual del proceso

**Paso 4: Generación de Pruebas ZK**
- Loading state mientras se generan las pruebas
- Progress bar con 3 pasos:
  1. Generando prueba de edad...
  2. Generando prueba de nacionalidad...
  3. Generando prueba de identidad única...
- Confetti o animación de éxito al terminar

**Paso 5: Fragmentación y Almacenamiento**
- Loading state de encriptación
- Mostrar los 5 fragmentos siendo distribuidos:
  - 📱 Navegador local
  - ⭐ Stellar Network
  - 🗄️ Supabase
  - ⚡ Redis
  - 🌐 IPFS
- Confirmación final

**Estructura sugerida**:
```tsx
'use client'
import { useState } from 'react'
import { useIdentityStore } from '@/store/useIdentityStore'
import CameraCapture from '@/components/camera/CameraCapture'
import BiometricCapture from '@/components/biometric/BiometricCapture'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const { setStellarPublicKey, setBiometricId, setKycStep } = useIdentityStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Progress Steps */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        {step === 1 && <WalletConnect onConnect={handleWalletConnect} />}
        {step === 2 && <CameraCapture onCapture={handleDocumentCapture} />}
        {step === 3 && <BiometricCapture onCapture={handleBiometricCapture} />}
        {step === 4 && <ZKProofGeneration onComplete={handleProofGeneration} />}
        {step === 5 && <FragmentationStep onComplete={handleComplete} />}
      </div>
    </div>
  )
}
```

#### 3. Dashboard (`apps/web/app/dashboard/page.tsx`)
**Estado actual**: Placeholder simple

**Lo que necesitas mostrar**:

**Panel de Pruebas ZK**
- Card para cada prueba generada:
  - ✅ Prueba de Edad (Mayor de 18)
  - ✅ Prueba de Nacionalidad (Argentina)
  - ✅ Prueba de Identidad Única
- Cada card debe mostrar:
  - Icono representativo
  - Tipo de prueba
  - Estado: ✅ Generada / ⏳ Pendiente
  - Fecha de creación
  - Hash de la prueba (primeros 8 caracteres)
  - Botón "Ver detalles"

**Panel de Stellar**
- Mostrar wallet conectada
- Botón para desconectar
- Link a explorador de Stellar (testnet)

**Panel de Fragmentos**
- Mostrar dónde están almacenados los fragmentos
- Estado de cada ubicación (✅ Almacenado / ⚠️ Error)

**Ejemplo de estructura**:
```tsx
export default function DashboardPage() {
  const { proofs, stellarPublicKey } = useIdentityStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mi Identidad ZK</h1>

        {/* Proofs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ProofCard
            type="age"
            title="Mayor de Edad"
            icon={<Calendar />}
            hash={proofs.age}
            status="generated"
          />
          <ProofCard
            type="nationality"
            title="Nacionalidad Argentina"
            icon={<Flag />}
            hash={proofs.nationality}
            status="generated"
          />
          <ProofCard
            type="identity"
            title="Identidad Única"
            icon={<Fingerprint />}
            hash={proofs.identity}
            status="generated"
          />
        </div>

        {/* Stellar Account */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cuenta Stellar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">{stellarPublicKey}</p>
          </CardContent>
        </Card>

        {/* Fragments Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Fragmentos</CardTitle>
          </CardHeader>
          <CardContent>
            <FragmentStatus />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### Componentes a Crear

#### 1. Layout y Navegación
**Archivo**: `apps/web/components/layout/Navigation.tsx`

- Header con logo
- Menú de navegación (mobile hamburger)
- Botón de wallet (mostrar si está conectado)
- Dark mode toggle (opcional)

#### 2. Cards de Pruebas ZK
**Archivo**: `apps/web/components/dashboard/ProofCard.tsx`

```tsx
interface ProofCardProps {
  type: 'age' | 'nationality' | 'identity'
  title: string
  icon: React.ReactNode
  hash?: string
  status: 'generated' | 'pending' | 'error'
}

export function ProofCard({ type, title, icon, hash, status }: ProofCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-full">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {status === 'generated' && hash && (
          <>
            <p className="text-sm text-gray-600 mb-2">Hash de prueba:</p>
            <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
              {hash.substring(0, 16)}...
            </code>
          </>
        )}
        {status === 'pending' && (
          <div className="flex items-center gap-2 text-yellow-600">
            <Loader className="animate-spin" size={16} />
            <span>Generando...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

#### 3. Loading States
**Archivo**: `apps/web/components/ui/LoadingSpinner.tsx`

Para los diferentes estados de carga:
- Generando pruebas ZK
- Encriptando datos
- Conectando wallet
- Subiendo a IPFS

#### 4. Wallet Connect Button
**Archivo**: `apps/web/components/stellar/WalletConnect.tsx`

```tsx
'use client'
import { useState } from 'react'
import { connectWallet } from '@zk-identity/stellar-utils'
import { Button } from '@/components/ui/button'

export function WalletConnect({ onConnect }: { onConnect: (pubkey: string) => void }) {
  const [loading, setLoading] = useState(false)

  async function handleConnect() {
    try {
      setLoading(true)
      const publicKey = await connectWallet()
      onConnect(publicKey)
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleConnect} disabled={loading}>
      {loading ? 'Conectando...' : 'Conectar Freighter Wallet'}
    </Button>
  )
}
```

### Stack Tecnológico que Ya Tienes

**Framework & Routing**:
- ✅ Next.js 14 con App Router
- ✅ TypeScript
- ✅ React 18

**Styling**:
- ✅ Tailwind CSS (configurado con tema personalizado)
- ✅ Shadcn/ui components (Button, Card, Dialog ya incluidos)
- ✅ class-variance-authority para variants
- ✅ tailwind-merge para combinar clases

**Animaciones**:
- ✅ Framer Motion (para animaciones suaves)
- ✅ Tailwind Animate

**Iconos**:
- ✅ Lucide React

**State Management**:
- ✅ Zustand (store en `apps/web/store/useIdentityStore.ts`)
- ✅ React Query (para llamadas async)

**UI Components**:
- ✅ Radix UI (Dialog, Toast, Tabs, Slot)

### Zustand Store (Estado Global)

Ya tienes configurado el store en `apps/web/store/useIdentityStore.ts`:

```tsx
import { useIdentityStore } from '@/store/useIdentityStore'

// En tus componentes:
const {
  stellarPublicKey,
  biometricId,
  kycCompleted,
  kycStep,
  proofs,
  setStellarPublicKey,
  setBiometricId,
  setKycStep,
  setProof,
  completeKyc,
  reset
} = useIdentityStore()
```

### Colores y Tema

Ya configurados en `tailwind.config.ts`:

```tsx
// Colores primarios
bg-primary-50   // Azul muy claro
bg-primary-500  // Azul principal #3b82f6
bg-primary-900  // Azul oscuro

// Usar en componentes
<div className="bg-primary-500 text-white">
  Botón principal
</div>
```

### Archivos Donde Debes Trabajar

```
apps/web/
├── app/
│   ├── page.tsx                    ⭐ Home page - EDITAR
│   ├── layout.tsx                  ✅ Ya configurado
│   ├── onboarding/
│   │   └── page.tsx                ⭐ Onboarding flow - IMPLEMENTAR
│   └── dashboard/
│       └── page.tsx                ⭐ Dashboard - IMPLEMENTAR
│
├── components/
│   ├── ui/                         ✅ Shadcn components
│   │   ├── button.tsx              ✅ Ya creado
│   │   ├── card.tsx                ✅ Ya creado
│   │   └── dialog.tsx              ✅ Ya creado
│   │
│   ├── layout/                     ⭐ CREAR
│   │   ├── Navigation.tsx          ⭐ Header/nav
│   │   └── Footer.tsx              ⭐ Footer (opcional)
│   │
│   ├── dashboard/                  ⭐ CREAR
│   │   ├── ProofCard.tsx           ⭐ Card de pruebas
│   │   ├── FragmentStatus.tsx      ⭐ Estado fragmentos
│   │   └── StellarAccount.tsx      ⭐ Info cuenta Stellar
│   │
│   ├── onboarding/                 ⭐ CREAR
│   │   ├── StepIndicator.tsx       ⭐ Progress steps
│   │   ├── WalletConnect.tsx       ⭐ Conectar wallet
│   │   ├── DocumentCapture.tsx     ⭐ Wrapper para cámara
│   │   ├── BiometricStep.tsx       ⭐ Wrapper para biométrico
│   │   ├── ZKProofGeneration.tsx   ⭐ Loading + progress
│   │   └── FragmentationStep.tsx   ⭐ Distribución fragmentos
│   │
│   └── shared/                     ⭐ CREAR
│       ├── LoadingSpinner.tsx      ⭐ Spinner
│       └── SuccessAnimation.tsx    ⭐ Confetti/check
│
└── lib/
    ├── utils.ts                    ✅ Ya creado (cn helper)
    └── constants.ts                ✅ Ya creado
```

### Guía de Diseño

**Principios de diseño mobile-first**:
1. **Todo debe funcionar en móvil primero** (320px+)
2. Usar `min-h-screen` para páginas completas
3. Padding consistente: `p-6` en mobile, `p-8` en desktop
4. Usar grid responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

**Paleta de colores**:
- Primario: Azul (#3b82f6)
- Fondo: Gradientes sutiles (from-blue-50 to-indigo-100)
- Texto: gray-900 (títulos), gray-600 (descripciones)
- Éxito: green-500
- Error: red-500
- Warning: yellow-500

**Tipografía**:
- Títulos grandes: `text-4xl md:text-5xl font-bold`
- Subtítulos: `text-xl md:text-2xl`
- Texto normal: `text-base`
- Texto pequeño: `text-sm text-gray-600`

**Espaciado**:
- Entre secciones: `mb-8` o `mb-16`
- Entre elementos: `gap-4` o `gap-6`
- Padding de cards: `p-6`

### Cómo Probar Tu Trabajo

#### 1. Desarrollo Local
```bash
# Asegúrate de estar en el root del proyecto
cd /ruta/al/proyecto

# Instalar dependencias (si aún no lo hiciste)
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# La app estará en http://localhost:3000
```

#### 2. Hot Module Replacement
Cualquier cambio que hagas en archivos `.tsx` o `.css` se reflejará automáticamente en el navegador sin necesidad de recargar.

#### 3. Modo Responsive
- Usa Chrome DevTools (F12)
- Click en el icono de móvil (Toggle device toolbar)
- Prueba en diferentes tamaños:
  - iPhone SE (375px)
  - iPhone 12 Pro (390px)
  - iPad (768px)
  - Desktop (1280px+)

#### 4. Probar con Componentes de Tus Compañeras

Mientras ellas trabajan, puedes crear **mocks** temporales:

```tsx
// apps/web/components/camera/CameraCapture.tsx (TEMPORAL)
export default function CameraCapture({ onCapture }: { onCapture: (data: any) => void }) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <p className="text-gray-600 mb-4">Componente de cámara (mock)</p>
      <Button onClick={() => onCapture({
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        fechaNacimiento: '1990-01-01',
        nacionalidad: 'Argentina'
      })}>
        Simular Captura
      </Button>
    </div>
  )
}
```

### Integración con el Trabajo de Tus Compañeras

#### Con Isa (Cámara):
Ella creará `apps/web/components/camera/CameraCapture.tsx`. Cuando esté lista, reemplaza el mock:

```tsx
import CameraCapture from '@/components/camera/CameraCapture'

// En tu componente de onboarding:
<CameraCapture onCapture={(dniData) => {
  // dniData tendrá: { nombre, apellido, dni, fechaNacimiento, nacionalidad }
  setDniData(dniData)
  setStep(3) // Siguiente paso
}} />
```

#### Con Karu (Biométrico):
Ella creará `apps/web/components/biometric/BiometricCapture.tsx`. Uso:

```tsx
import BiometricCapture from '@/components/biometric/BiometricCapture'

<BiometricCapture onCapture={(biometricId) => {
  // biometricId es el hash único de la huella
  setBiometricId(biometricId)
  setStep(4)
}} />
```

#### Con Denisse (Encriptación):
Ella implementará funciones en `packages/crypto/`. Uso:

```tsx
import { encryptData, createShamirShares } from '@zk-identity/crypto'

// Cuando necesites encriptar y fragmentar:
const encrypted = await encryptData(JSON.stringify(dniData), key)
const fragments = createShamirShares(encrypted, 5, 3)
// fragments = ['frag1', 'frag2', 'frag3', 'frag4', 'frag5']
```

#### Con Anouk (ZK Circuits):
Ella implementará funciones en `packages/zk-circuits/`. Uso:

```tsx
import { generateAgeProof, generateNationalityProof, generateIdentityProof } from '@zk-identity/zk-circuits'

// Generar pruebas:
const ageProof = await generateAgeProof(new Date(dniData.fechaNacimiento))
const nationalityProof = await generateNationalityProof(dniData.nacionalidad)
const identityProof = await generateIdentityProof(dniData.dni)
```

### Ejemplos Completos

#### Ejemplo: Página de Onboarding Completa

```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useIdentityStore } from '@/store/useIdentityStore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import WalletConnect from '@/components/onboarding/WalletConnect'
import CameraCapture from '@/components/camera/CameraCapture'
import BiometricCapture from '@/components/biometric/BiometricCapture'
import { Check, Loader2 } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Conectar Wallet', icon: '🔗' },
  { id: 2, title: 'Capturar DNI', icon: '📷' },
  { id: 3, title: 'Registro Biométrico', icon: '👆' },
  { id: 4, title: 'Generar Pruebas ZK', icon: '🔐' },
  { id: 5, title: 'Fragmentar Datos', icon: '🧩' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [dniData, setDniData] = useState(null)
  const {
    setStellarPublicKey,
    setBiometricId,
    setKycStep,
    completeKyc
  } = useIdentityStore()

  const handleWalletConnect = (publicKey: string) => {
    setStellarPublicKey(publicKey)
    setKycStep('document')
    setCurrentStep(2)
  }

  const handleDocumentCapture = (data: any) => {
    setDniData(data)
    setKycStep('biometric')
    setCurrentStep(3)
  }

  const handleBiometricCapture = (bioId: string) => {
    setBiometricId(bioId)
    setKycStep('zk-generation')
    setCurrentStep(4)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Step Circles */}
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    step.id < currentStep
                      ? 'bg-green-500 text-white'
                      : step.id === currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {step.id < currentStep ? <Check size={24} /> : step.icon}
                </motion.div>
                <span className="text-xs mt-2 text-gray-600 max-w-[80px] text-center">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              {currentStep === 1 && (
                <WalletConnect onConnect={handleWalletConnect} />
              )}

              {currentStep === 2 && (
                <CameraCapture onCapture={handleDocumentCapture} />
              )}

              {currentStep === 3 && (
                <BiometricCapture onCapture={handleBiometricCapture} />
              )}

              {currentStep === 4 && (
                <ZKGenerationStep
                  dniData={dniData}
                  onComplete={() => setCurrentStep(5)}
                />
              )}

              {currentStep === 5 && (
                <FragmentationStep
                  onComplete={() => {
                    completeKyc()
                    router.push('/dashboard')
                  }}
                />
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Componente auxiliar para generación ZK
function ZKGenerationStep({ dniData, onComplete }: any) {
  const [progress, setProgress] = useState(0)
  const proofs = ['Edad', 'Nacionalidad', 'Identidad']

  useEffect(() => {
    // Simular generación de pruebas
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 1000)
          return 100
        }
        return prev + 33.33
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Generando Pruebas Zero Knowledge</h2>

      <div className="space-y-4 mb-8">
        {proofs.map((proof, idx) => (
          <div key={proof} className="flex items-center gap-3">
            {progress > idx * 33.33 ? (
              <Check className="text-green-500" />
            ) : (
              <Loader2 className="animate-spin text-blue-500" />
            )}
            <span>Prueba de {proof}</span>
          </div>
        ))}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-blue-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
```

### Recursos y Referencias

**Documentación**:
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)

**Inspiración de diseño**:
- [Dribbble - KYC Designs](https://dribbble.com/search/kyc)
- [Figma Community](https://www.figma.com/community)

### Checklist de Tareas

**Home Page**:
- [ ] Hero section con título y descripción
- [ ] Grid de features (3 características principales)
- [ ] Call-to-action con animación
- [ ] Iconos y animaciones con Framer Motion
- [ ] Responsive mobile-first

**Onboarding**:
- [ ] Progress indicator (5 pasos)
- [ ] Paso 1: Wallet connect
- [ ] Paso 2: Integrar componente de cámara
- [ ] Paso 3: Integrar componente biométrico
- [ ] Paso 4: Loading ZK generation con progress
- [ ] Paso 5: Fragmentación con visualización
- [ ] Animaciones entre pasos
- [ ] Validaciones en cada paso

**Dashboard**:
- [ ] Grid de cards de pruebas ZK
- [ ] Cada card muestra tipo, hash, fecha
- [ ] Panel de cuenta Stellar conectada
- [ ] Panel de estado de fragmentos
- [ ] Botón para ver detalles de cada prueba
- [ ] Navegación funcional

**Componentes Compartidos**:
- [ ] Navigation header
- [ ] Loading spinner component
- [ ] Success animation (confetti o checkmark)
- [ ] Error state component
- [ ] Toast notifications

**Testing**:
- [ ] Probado en mobile (375px)
- [ ] Probado en tablet (768px)
- [ ] Probado en desktop (1280px+)
- [ ] Animaciones suaves
- [ ] No hay errores en consola

### Consejos Finales

1. **Mobile-first siempre**: Diseña primero en 375px, luego escala hacia arriba
2. **Usa los componentes de Shadcn**: Ya están configurados, solo imporpórtalos
3. **Animaciones sutiles**: No exageres con Framer Motion, que sea natural
4. **Consistencia**: Usa el mismo spacing, colores y tipografía en todo
5. **Loading states**: Siempre muestra feedback cuando algo está cargando
6. **Error handling**: Prepara mensajes de error claros y amigables

### Comunicación con el Equipo

**Si necesitas algo de tus compañeras**:
- Pregunta en el grupo qué interface espera cada componente
- Mientras tanto, usa mocks como los que te mostré arriba
- Coordina para integrar cuando sus componentes estén listos

**Lo que tus compañeras necesitan de ti**:
- Interfaces claras de props para los componentes que integres
- Feedback visual cuando sus funciones sean llamadas (loading, success, error)

¡Mucha suerte Angie! Estás creando la cara visible del proyecto, la parte con la que los usuarios interactúan. ¡Hazla hermosa! 🎨✨
