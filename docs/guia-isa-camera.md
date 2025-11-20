# Guía Componente de Cámara - Isa

## 🎯 Contexto del Proyecto

### ¿Qué estamos construyendo?

**ZK Identity Stellar** es un sistema donde los usuarios hacen KYC **una sola vez** capturando su DNI con la cámara del móvil, y luego generan pruebas criptográficas Zero Knowledge para demostrar atributos (edad, nacionalidad, identidad única) sin revelar datos personales.

### Tu Rol: Captura de Documento

Eres la **puerta de entrada de datos**. Sin tu componente, no hay forma de que el usuario ingrese su información. Tu tarea es crear una experiencia de captura de DNI que sea:
- 📱 Mobile-first (la mayoría de usuarios usarán su celular)
- 🎯 Precisa (detectar bien el documento)
- ✨ Intuitiva (guiar al usuario)
- 🚀 Rápida (proceso fluido)

## 👥 Equipo y Responsabilidades

### Tu Rol: Camera Component (Isa)
**Responsabilidad**: Capturar foto del DNI y extraer datos (nombre, apellido, DNI, fecha nacimiento, nacionalidad)

### Tus Compañeras:

1. **Angie** - Frontend
   - Crea toda la UI donde TU componente se integrará
   - Te pasa el callback para cuando captures la foto
   - Muestra loading states y transiciones
   - Archivos: `apps/web/app/`, `apps/web/components/`

2. **Denisse** - Database & Encryption
   - Toma los datos que TÚ extraes del DNI
   - Los encripta con AES-256-GCM
   - Los fragmenta con Shamir Secret Sharing
   - Archivos: `packages/crypto/`

3. **Karu** - Biometría & Hash
   - Después de tu captura, viene la captura biométrica
   - Genera identificadores únicos
   - También usa hashing
   - Archivos: `apps/web/components/biometric/`

4. **Anouk** - Zero Knowledge Circuits
   - Usa los datos que extraes para generar pruebas ZK
   - Prueba de edad, nacionalidad, identidad
   - Archivos: `packages/zk-circuits/`

## 📸 Tu Tarea: Camera Capture Component

### Objetivo Principal

Crear un componente React que:
1. Acceda a la cámara del dispositivo
2. Muestre un preview en vivo
3. Detecte bordes del documento (opcional pero cool)
4. Capture la foto del DNI
5. Extraiga datos del documento (mock OCR para el hackathon)
6. Retorne los datos estructurados

### Archivo Principal

```
apps/web/components/camera/
├── CameraCapture.tsx           ⭐ Componente principal
├── DocumentDetector.tsx        ⭐ Detección de bordes (opcional)
├── MockOCR.ts                  ⭐ Mock extracción de datos
└── types.ts                    ⭐ TypeScript types
```

### Stack Tecnológico que Ya Tienes

**Librería de Cámara**:
- ✅ `react-camera-pro` (ya instalada)
  - Componente React listo para usar
  - Soporta mobile y desktop
  - Fácil captura de fotos

**Opcional para Detección**:
- ✅ `@tensorflow/tfjs` (no instalado, pero puedes agregarlo si quieres)
  - Para detección de bordes/documentos
  - Puede ser heavy para mobile

**Para Procesamiento de Imagen**:
- ✅ Canvas API (nativo del browser)
  - Manipular la imagen capturada
  - Aplicar filtros, recortar, etc.

## 📱 Implementación Paso a Paso

### Paso 1: Tipos TypeScript

**Archivo**: `apps/web/components/camera/types.ts`

```typescript
export interface DNIData {
  nombre: string
  apellido: string
  dni: string
  fechaNacimiento: string // formato: "YYYY-MM-DD"
  nacionalidad: 'Argentina'
  sexo?: 'M' | 'F' | 'X'
  // Opcional: puedes agregar más campos
}

export interface CameraCaptureProps {
  onCapture: (data: DNIData) => void
  onError?: (error: string) => void
  onCancel?: () => void
}

export interface CaptureState {
  isCapturing: boolean
  hasPhoto: boolean
  photoDataUrl: string | null
  isProcessing: boolean
  documentDetected: boolean
}
```

### Paso 2: Mock OCR (Para el Hackathon)

Como implementar OCR real requiere tiempo y APIs externas, vamos a hacer un **mock** que simule la extracción de datos. En producción, esto se reemplazaría con un servicio real de OCR.

**Archivo**: `apps/web/components/camera/MockOCR.ts`

```typescript
import { DNIData } from './types'

/**
 * Mock OCR - Simula extracción de datos de un DNI
 * En producción, esto usaría Tesseract.js, Google Vision API, o similar
 */
export async function extractDNIData(imageDataUrl: string): Promise<DNIData> {
  // Simular delay de procesamiento (300-800ms)
  const delay = Math.random() * 500 + 300
  await new Promise(resolve => setTimeout(resolve, delay))

  // Para el hackathon, podemos:
  // 1. Retornar datos mock aleatorios
  // 2. Dejar que el usuario los edite manualmente
  // 3. Usar una combinación de ambos

  // Generar datos mock realistas
  const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Laura']
  const apellidos = ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez']

  const nombre = nombres[Math.floor(Math.random() * nombres.length)]
  const apellido = apellidos[Math.floor(Math.random() * apellidos.length)]

  // DNI aleatorio (8 dígitos)
  const dni = Math.floor(10000000 + Math.random() * 90000000).toString()

  // Fecha de nacimiento aleatoria (entre 1970 y 2005)
  const year = Math.floor(1970 + Math.random() * 35)
  const month = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')
  const day = String(Math.floor(1 + Math.random() * 28)).padStart(2, '0')
  const fechaNacimiento = `${year}-${month}-${day}`

  return {
    nombre,
    apellido,
    dni,
    fechaNacimiento,
    nacionalidad: 'Argentina',
    sexo: Math.random() > 0.5 ? 'M' : 'F'
  }
}

/**
 * Análisis básico de imagen para "simular" detección de documento
 * Verifica que la imagen tenga suficiente contraste y no esté muy oscura/clara
 */
export function analyzeImageQuality(imageDataUrl: string): {
  quality: 'good' | 'poor'
  message: string
} {
  // En una implementación real, analizarías:
  // - Contraste
  // - Nitidez
  // - Iluminación
  // - Presencia de bordes rectangulares

  // Por ahora, simulamos con un random
  const isGood = Math.random() > 0.2 // 80% de probabilidad de éxito

  if (isGood) {
    return {
      quality: 'good',
      message: 'Documento detectado correctamente'
    }
  } else {
    return {
      quality: 'poor',
      message: 'Imagen borrosa o con poca luz. Por favor, intenta de nuevo.'
    }
  }
}
```

### Paso 3: Componente Principal de Cámara

**Archivo**: `apps/web/components/camera/CameraCapture.tsx`

```typescript
'use client'
import { useState, useRef } from 'react'
import { Camera } from 'react-camera-pro'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { extractDNIData, analyzeImageQuality } from './MockOCR'
import { CameraCaptureProps, CaptureState, DNIData } from './types'
import { Camera as CameraIcon, RotateCcw, Check, X, Loader2 } from 'lucide-react'

export default function CameraCapture({ onCapture, onError, onCancel }: CameraCaptureProps) {
  const camera = useRef<any>(null)

  const [state, setState] = useState<CaptureState>({
    isCapturing: false,
    hasPhoto: false,
    photoDataUrl: null,
    isProcessing: false,
    documentDetected: false
  })

  const [extractedData, setExtractedData] = useState<DNIData | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Capturar foto
  const handleCapture = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto()
      setState(prev => ({
        ...prev,
        hasPhoto: true,
        photoDataUrl: photo,
        isCapturing: false
      }))
    }
  }

  // Retomar foto
  const handleRetake = () => {
    setState({
      isCapturing: false,
      hasPhoto: false,
      photoDataUrl: null,
      isProcessing: false,
      documentDetected: false
    })
    setExtractedData(null)
  }

  // Procesar la foto y extraer datos
  const handleProcess = async () => {
    if (!state.photoDataUrl) return

    setState(prev => ({ ...prev, isProcessing: true }))

    try {
      // 1. Analizar calidad de imagen
      const qualityCheck = analyzeImageQuality(state.photoDataUrl)

      if (qualityCheck.quality === 'poor') {
        throw new Error(qualityCheck.message)
      }

      // 2. Extraer datos (Mock OCR)
      const data = await extractDNIData(state.photoDataUrl)
      setExtractedData(data)

      setState(prev => ({
        ...prev,
        isProcessing: false,
        documentDetected: true
      }))
    } catch (error) {
      setState(prev => ({ ...prev, isProcessing: false }))
      onError?.(error.message)

      // Volver a permitir retomar foto
      setTimeout(handleRetake, 2000)
    }
  }

  // Confirmar y enviar datos
  const handleConfirm = () => {
    if (extractedData) {
      onCapture(extractedData)
    }
  }

  // Manejar error de cámara
  const handleCameraError = (error: any) => {
    console.error('Error de cámara:', error)
    setCameraError('No se pudo acceder a la cámara. Verifica los permisos.')
    onError?.('No se pudo acceder a la cámara')
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CameraIcon className="w-6 h-6" />
            Captura tu DNI
          </CardTitle>
          <p className="text-sm text-gray-600">
            Coloca tu DNI dentro del marco y asegúrate de que esté bien iluminado
          </p>
        </CardHeader>

        <CardContent>
          {/* Vista de Cámara */}
          {!state.hasPhoto && !cameraError && (
            <div className="relative">
              {/* Componente de Cámara */}
              <div className="relative rounded-lg overflow-hidden bg-black aspect-[4/3]">
                <Camera
                  ref={camera}
                  aspectRatio={4 / 3}
                  errorMessages={{
                    noCameraAccessible: 'No hay cámara disponible',
                    permissionDenied: 'Permiso de cámara denegado',
                    switchCamera: 'No se puede cambiar de cámara',
                    canvas: 'Canvas no soportado'
                  }}
                  onError={handleCameraError}
                />

                {/* Overlay: Guía de documento */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-4 border-blue-500 border-dashed rounded-lg w-[80%] h-[70%] flex items-center justify-center">
                    <p className="text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                      Coloca tu DNI aquí
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de Captura */}
              <div className="mt-6 flex gap-3 justify-center">
                <Button
                  onClick={handleCapture}
                  size="lg"
                  className="rounded-full w-16 h-16"
                >
                  <CameraIcon className="w-8 h-8" />
                </Button>
                {onCancel && (
                  <Button
                    onClick={onCancel}
                    variant="outline"
                    size="lg"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Error de Cámara */}
          {cameraError && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <X className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-lg font-medium mb-2">Error de Cámara</p>
              <p className="text-gray-600 mb-4">{cameraError}</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          )}

          {/* Preview de Foto Capturada */}
          {state.hasPhoto && state.photoDataUrl && !extractedData && (
            <div>
              <img
                src={state.photoDataUrl}
                alt="DNI capturado"
                className="w-full rounded-lg mb-4"
              />

              {/* Botones de Acción */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleRetake}
                  variant="outline"
                  disabled={state.isProcessing}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retomar
                </Button>
                <Button
                  onClick={handleProcess}
                  disabled={state.isProcessing}
                >
                  {state.isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Procesar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Datos Extraídos */}
          {extractedData && (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-medium text-center">
                  ✓ Documento procesado exitosamente
                </p>
              </div>

              <div className="bg-white border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold mb-3">Datos Extraídos:</h3>

                <DataField label="Nombre" value={extractedData.nombre} />
                <DataField label="Apellido" value={extractedData.apellido} />
                <DataField label="DNI" value={extractedData.dni} />
                <DataField label="Fecha de Nacimiento" value={extractedData.fechaNacimiento} />
                <DataField label="Nacionalidad" value={extractedData.nacionalidad} />
                {extractedData.sexo && (
                  <DataField
                    label="Sexo"
                    value={extractedData.sexo === 'M' ? 'Masculino' : extractedData.sexo === 'F' ? 'Femenino' : 'Otro'}
                  />
                )}
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <Button
                  onClick={handleRetake}
                  variant="outline"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retomar
                </Button>
                <Button onClick={handleConfirm}>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar Datos
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente auxiliar para mostrar campos de datos
function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <span className="text-gray-600 text-sm">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
```

### Paso 4: Versión con Edición Manual (Opcional)

Para darle más control al usuario, puedes crear una versión que permita editar los datos:

**Archivo**: `apps/web/components/camera/EditableDNIForm.tsx`

```typescript
'use client'
import { useState } from 'react'
import { DNIData } from './types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check } from 'lucide-react'

interface EditableDNIFormProps {
  initialData: DNIData
  onConfirm: (data: DNIData) => void
  onCancel: () => void
}

export function EditableDNIForm({ initialData, onConfirm, onCancel }: EditableDNIFormProps) {
  const [data, setData] = useState<DNIData>(initialData)

  const handleChange = (field: keyof DNIData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <Input
          value={data.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Apellido</label>
        <Input
          value={data.apellido}
          onChange={(e) => handleChange('apellido', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">DNI</label>
        <Input
          value={data.dni}
          onChange={(e) => handleChange('dni', e.target.value)}
          pattern="[0-9]{7,8}"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha de Nacimiento</label>
        <Input
          type="date"
          value={data.fechaNacimiento}
          onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          <Check className="w-4 h-4 mr-2" />
          Confirmar
        </Button>
      </div>
    </form>
  )
}
```

### Paso 5: Detección de Documento (Avanzado/Opcional)

Si quieres agregar detección automática de bordes del documento usando Canvas:

**Archivo**: `apps/web/components/camera/DocumentDetector.tsx`

```typescript
/**
 * Detecta si hay un rectángulo (documento) en la imagen
 * Usa análisis de bordes con Canvas API
 */
export function detectDocument(imageDataUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        resolve(false)
        return
      }

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Obtener datos de imagen
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Análisis básico de contraste
      // En producción usarías algoritmos más sofisticados (Canny edge detection, etc.)
      let edgePixels = 0
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Detectar píxeles "edge" (cambios bruscos)
        const brightness = (r + g + b) / 3
        if (brightness > 200 || brightness < 50) {
          edgePixels++
        }
      }

      // Si hay suficientes bordes, asumimos que hay un documento
      const edgePercentage = (edgePixels / (data.length / 4)) * 100
      const hasDocument = edgePercentage > 15 && edgePercentage < 40

      resolve(hasDocument)
    }

    img.src = imageDataUrl
  })
}
```

### Cómo Integrar con el Trabajo de Angie

Angie lo usará en el flow de onboarding:

```typescript
// En apps/web/app/onboarding/page.tsx (Angie)
import CameraCapture from '@/components/camera/CameraCapture'

export default function OnboardingPage() {
  const handleDNICapture = (dniData: DNIData) => {
    console.log('Datos capturados:', dniData)

    // Guardar en estado global (Zustand)
    setDniData(dniData)

    // Pasar al siguiente paso
    setStep(3)
  }

  return (
    <div>
      {step === 2 && (
        <CameraCapture
          onCapture={handleDNICapture}
          onError={(error) => {
            toast.error(error)
          }}
          onCancel={() => setStep(1)}
        />
      )}
    </div>
  )
}
```

### Cómo Probar Tu Componente

#### Test 1: Renderizado Básico

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Navegar a http://localhost:3000/onboarding
```

#### Test 2: En Página de Prueba

Crea una página de prueba solo para tu componente:

```typescript
// apps/web/app/test-camera/page.tsx
'use client'
import CameraCapture from '@/components/camera/CameraCapture'

export default function TestCameraPage() {
  const handleCapture = (data) => {
    console.log('✅ Datos capturados:', data)
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Test Componente Cámara</h1>
      <CameraCapture
        onCapture={handleCapture}
        onError={(error) => alert('Error: ' + error)}
      />
    </div>
  )
}
```

#### Test 3: Mobile Testing

1. En Chrome DevTools → Device Toolbar (Ctrl+Shift+M)
2. Selecciona un dispositivo móvil (iPhone 12 Pro)
3. Verifica que:
   - La cámara se abre correctamente
   - El preview se ve bien
   - Los botones son táctiles y grandes
   - La UI es responsive

### Permisos de Cámara

**Desktop**: El browser pedirá permisos automáticamente

**Mobile**:
- En HTTPS funcionará automáticamente
- En localhost también (es considerado seguro)
- El usuario verá un popup de permisos la primera vez

### Mejoras Opcionales

1. **Flip Camera** (cambiar entre frontal/trasera):
```typescript
const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

<Camera
  facingMode={facingMode}
  // ...
/>

<Button onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}>
  Cambiar cámara
</Button>
```

2. **Flash/Torch** (si el dispositivo lo soporta):
```typescript
// Requiere API experimental
const toggleTorch = async () => {
  const stream = camera.current?.stream
  if (stream) {
    const track = stream.getVideoTracks()[0]
    await track.applyConstraints({
      advanced: [{ torch: true }]
    })
  }
}
```

3. **Zoom**:
```typescript
const [zoom, setZoom] = useState(1)

// En el render
<input
  type="range"
  min="1"
  max="3"
  step="0.1"
  value={zoom}
  onChange={(e) => setZoom(Number(e.target.value))}
/>
```

### Checklist de Tareas

**Componente Básico**:
- [ ] Crear `CameraCapture.tsx`
- [ ] Integrar `react-camera-pro`
- [ ] Captura de foto funcional
- [ ] Preview de foto
- [ ] Botón de retomar

**Mock OCR**:
- [ ] Implementar `extractDNIData()` con datos mock
- [ ] Delay realista de procesamiento
- [ ] Análisis de calidad de imagen básico
- [ ] Retornar datos estructurados correctamente

**UI/UX**:
- [ ] Overlay de guía de documento
- [ ] Loading states
- [ ] Error states
- [ ] Success feedback
- [ ] Responsive mobile-first

**Datos Extraídos**:
- [ ] Mostrar datos en formato legible
- [ ] Opción de editar datos (opcional)
- [ ] Validación básica de campos
- [ ] Botón de confirmar

**Testing**:
- [ ] Probado en móvil real
- [ ] Probado en diferentes browsers
- [ ] Permisos de cámara funcionan
- [ ] Foto se captura correctamente
- [ ] Datos se pasan al callback

### Recursos y Referencias

**react-camera-pro**:
- [NPM Package](https://www.npmjs.com/package/react-camera-pro)
- [GitHub](https://github.com/purple-technology/react-camera-pro)

**MediaDevices API**:
- [MDN getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [MediaStream API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_API)

**Canvas API**:
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

**OCR Real (para después del hackathon)**:
- [Tesseract.js](https://tesseract.projectnaptha.com/)
- [Google Vision API](https://cloud.google.com/vision/docs/ocr)

### Consejos Finales

1. **Mobile-first**: El 90% de usuarios usarán móvil, optimiza para eso
2. **Feedback claro**: Siempre muestra qué está pasando (loading, success, error)
3. **Guías visuales**: El overlay de documento ayuda mucho a los usuarios
4. **Mock realista**: Para el hackathon, datos mock bien hechos son suficientes
5. **Testing exhaustivo**: Prueba en tu móvil real, no solo en DevTools

### Debugging Tips

**Si la cámara no abre**:
- Verifica que estés en HTTPS o localhost
- Chequea permisos del browser
- Revisa la consola para errores

**Si la foto sale oscura**:
- Aumenta la iluminación
- Ajusta configuración de ISO/exposure (si el dispositivo lo soporta)

**Si el componente no renderiza**:
- Verifica imports
- Chequea que `react-camera-pro` esté instalado
- Revisa errores en consola

¡Mucha suerte Isa! Tu componente es el primer contacto del usuario con nuestra app. ¡Hazlo intuitivo y fluido! 📸✨
