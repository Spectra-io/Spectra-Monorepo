# Guía Database & Threshold Encryption - Denisse

## 🎯 Contexto del Proyecto

### ¿Qué estamos construyendo?

**ZK Identity Stellar** es un sistema de identidad digital que permite a los usuarios hacer KYC una sola vez y generar pruebas criptográficas (Zero Knowledge Proofs) sin revelar sus datos personales.

### Tu Rol Crítico: Privacy & Security

Eres la **guardiana de la privacidad**. Tu responsabilidad es asegurar que los datos personales de los usuarios (DNI, nombre, fecha de nacimiento) **NUNCA** estén almacenados en texto plano en ningún lugar. Tu trabajo es la diferencia entre un sistema seguro y un desastre de privacidad.

### El Problema que Resuelves

Si almacenamos los datos del DNI en un solo lugar:
- ❌ Un hack compromete TODO
- ❌ Tenemos un solo punto de falla
- ❌ Violamos el principio de privacy-first

### Tu Solución: Threshold Encryption con Shamir Secret Sharing

1. **Encriptación**: Datos → AES-256-GCM → Texto cifrado
2. **Fragmentación**: Texto cifrado → Shamir (3 de 5) → 5 fragmentos
3. **Distribución**: Cada fragmento va a una ubicación diferente
4. **Reconstrucción**: Con cualquier 3 de 5 fragmentos → Recuperar datos originales

**Ubicaciones de los fragmentos**:
1. 📱 **IndexedDB** - Navegador del usuario
2. ⭐ **Stellar Data Entry** - On-chain (encriptado)
3. 🗄️ **Supabase** - PostgreSQL (columna encriptada)
4. ⚡ **Redis** - Upstash (con TTL de 90 días)
5. 🌐 **IPFS** - Web3.storage (encriptado + pinning)

## 👥 Equipo y Responsabilidades

### Tu Rol: Database & Threshold Encryption (Denisse)
**Responsabilidad**: Implementar toda la capa de encriptación, fragmentación y almacenamiento distribuido

### Tus Compañeras:

1. **Angie** - Frontend
   - Crea toda la UI/UX mobile-first
   - Integra tus funciones de encriptación en el flow
   - Muestra estado de fragmentos al usuario
   - Archivos: `apps/web/app/`, `apps/web/components/`

2. **Isa** - Componente de Cámara
   - Captura foto del DNI
   - Mock OCR para extraer datos
   - Te pasa los datos sin encriptar para que los protejas
   - Archivos: `apps/web/components/camera/`

3. **Karu** - Biometría & Hash
   - WebAuthn para huella digital
   - Genera identificadores biométricos únicos
   - También necesita que encriptes algunos datos biométricos
   - Archivos: `apps/web/components/biometric/`

4. **Anouk** - Zero Knowledge Circuits
   - Circuitos Circom para pruebas ZK
   - Usa tus funciones para proteger datos sensibles antes de generar pruebas
   - Archivos: `packages/zk-circuits/`

## 🔐 Tu Tarea: Encryption & Distribution

### Objetivo Principal

Implementar un sistema robusto de **Threshold Encryption** que:
1. Encripte datos sensibles con AES-256-GCM
2. Fragmente usando Shamir Secret Sharing (3-of-5)
3. Distribuya fragmentos en 5 ubicaciones diferentes
4. Permita reconstruir datos con cualquier 3 fragmentos
5. Nunca almacene datos sin encriptar

### Conceptos Clave

#### 1. AES-256-GCM (Advanced Encryption Standard)
**¿Qué es?**
- Algoritmo de encriptación simétrica (misma clave para encriptar y desencriptar)
- 256 bits de longitud de clave (muy seguro)
- GCM = Galois/Counter Mode (proporciona autenticación e integridad)

**¿Por qué lo usamos?**
- Es el estándar de la industria
- Muy rápido y seguro
- Detecta si los datos fueron manipulados

**Ejemplo**:
```typescript
// Datos originales
const datos = {
  nombre: "María",
  dni: "12345678",
  fechaNacimiento: "1990-01-01"
}

// Encriptado con AES-256-GCM
const datosEncriptados = "8f3a9d2b7c4e1..."  // Ilegible sin la clave
```

#### 2. Shamir Secret Sharing (Threshold Cryptography)
**¿Qué es?**
- Algoritmo matemático que divide un secreto en N partes
- Se necesitan K partes (threshold) para reconstruir el original
- Con menos de K partes, es **matemáticamente imposible** recuperar el secreto

**Nuestro caso: 3-of-5**
- Dividimos en 5 fragmentos
- Necesitamos mínimo 3 para reconstruir
- Cualquier combinación de 3 fragmentos funciona

**¿Por qué es genial?**
- Si hackean 1 o 2 ubicaciones → No pueden recuperar nada
- El usuario puede perder acceso a 2 fragmentos y aún recuperar sus datos
- Balance perfecto entre seguridad y disponibilidad

**Visualización**:
```
Secreto: "datos_encriptados_aquí"
         ↓
    Shamir (3 de 5)
         ↓
┌─────┬─────┬─────┬─────┬─────┐
│Frag1│Frag2│Frag3│Frag4│Frag5│
└─────┴─────┴─────┴─────┴─────┘

// Para reconstruir, necesitas 3 cualesquiera:
Frag1 + Frag2 + Frag4 = ✅ Secreto original
Frag2 + Frag3 + Frag5 = ✅ Secreto original
Frag1 + Frag3 + Frag5 = ✅ Secreto original
Frag1 + Frag2 = ❌ Insuficiente
```

### Archivos Donde Debes Trabajar

```
packages/crypto/
├── package.json                ✅ Ya creado
├── index.ts                    ⭐ IMPLEMENTAR
├── encryption.ts               ⭐ CREAR
├── shamir.ts                   ⭐ CREAR
├── distribution.ts             ⭐ CREAR
└── reconstruction.ts           ⭐ CREAR
```

### Implementación Paso a Paso

#### Paso 1: Encriptación con AES-256-GCM

**Archivo**: `packages/crypto/encryption.ts`

```typescript
import * as crypto from 'crypto'

/**
 * Genera una clave de encriptación aleatoria de 256 bits
 */
export function generateEncryptionKey(): string {
  const key = crypto.randomBytes(32) // 32 bytes = 256 bits
  return key.toString('hex')
}

/**
 * Encripta datos usando AES-256-GCM
 * @param data - Datos a encriptar (string)
 * @param key - Clave de encriptación (hex string de 64 caracteres)
 * @returns Objeto con datos encriptados, IV y auth tag
 */
export function encryptData(
  data: string,
  key: string
): {
  encryptedData: string
  iv: string
  authTag: string
} {
  // Convertir la clave de hex a Buffer
  const keyBuffer = Buffer.from(key, 'hex')

  // Generar un IV (Initialization Vector) aleatorio de 16 bytes
  const iv = crypto.randomBytes(16)

  // Crear cipher con AES-256-GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv)

  // Encriptar datos
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  // Obtener auth tag (para verificar integridad)
  const authTag = cipher.getAuthTag()

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  }
}

/**
 * Desencripta datos usando AES-256-GCM
 * @param encryptedData - Datos encriptados (hex string)
 * @param key - Clave de encriptación (hex string)
 * @param iv - Initialization Vector (hex string)
 * @param authTag - Authentication Tag (hex string)
 * @returns Datos originales desencriptados
 */
export function decryptData(
  encryptedData: string,
  key: string,
  iv: string,
  authTag: string
): string {
  const keyBuffer = Buffer.from(key, 'hex')
  const ivBuffer = Buffer.from(iv, 'hex')
  const authTagBuffer = Buffer.from(authTag, 'hex')

  // Crear decipher
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, ivBuffer)
  decipher.setAuthTag(authTagBuffer)

  // Desencriptar
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Hash SHA-256 de datos
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}
```

#### Paso 2: Shamir Secret Sharing

**Archivo**: `packages/crypto/shamir.ts`

Usaremos la librería `secrets.js-34r7h` que ya está instalada:

```typescript
import secrets from 'secrets.js-34r7h'

/**
 * Divide un secreto en fragmentos usando Shamir Secret Sharing
 * @param secret - Secreto a dividir (string hex)
 * @param totalShares - Número total de fragmentos a crear
 * @param threshold - Número mínimo de fragmentos necesarios para reconstruir
 * @returns Array de fragmentos (hex strings)
 */
export function createShamirShares(
  secret: string,
  totalShares: number = 5,
  threshold: number = 3
): string[] {
  // Validaciones
  if (threshold > totalShares) {
    throw new Error('Threshold no puede ser mayor que total de shares')
  }

  if (threshold < 2) {
    throw new Error('Threshold debe ser al menos 2')
  }

  // Convertir secreto a formato que secrets.js entiende
  // secrets.js espera hex strings
  const hexSecret = Buffer.from(secret, 'utf8').toString('hex')

  // Crear shares
  const shares = secrets.share(hexSecret, totalShares, threshold)

  return shares
}

/**
 * Reconstruye el secreto original a partir de fragmentos
 * @param shares - Array de al menos 'threshold' fragmentos
 * @returns Secreto original reconstruido
 */
export function reconstructFromShares(shares: string[]): string {
  // Validar que tengamos fragmentos
  if (!shares || shares.length === 0) {
    throw new Error('Se necesitan fragmentos para reconstruir')
  }

  // Reconstruir secreto
  const hexSecret = secrets.combine(shares)

  // Convertir de hex a string
  const secret = Buffer.from(hexSecret, 'hex').toString('utf8')

  return secret
}

/**
 * Genera metadatos para cada fragmento
 */
export function generateFragmentMetadata(
  fragmentIndex: number,
  totalFragments: number,
  threshold: number,
  createdAt: Date = new Date()
) {
  return {
    index: fragmentIndex,
    totalFragments,
    threshold,
    createdAt: createdAt.toISOString(),
    id: `frag_${fragmentIndex}_${Date.now()}`
  }
}
```

#### Paso 3: Distribución de Fragmentos

**Archivo**: `packages/crypto/distribution.ts`

Aquí implementarás la lógica para guardar fragmentos en cada ubicación:

```typescript
import { createClient } from '@supabase/supabase-js'
import { Redis } from '@upstash/redis'

// Tipos
export interface Fragment {
  index: number
  data: string
  location: 'local' | 'stellar' | 'supabase' | 'redis' | 'ipfs'
  metadata: {
    id: string
    createdAt: string
    threshold: number
    totalFragments: number
  }
}

export interface DistributionResult {
  success: boolean
  location: string
  fragmentId: string
  error?: string
}

/**
 * Guarda un fragmento en IndexedDB (navegador local)
 */
export async function saveToIndexedDB(
  fragment: Fragment,
  userId: string
): Promise<DistributionResult> {
  try {
    // Abrir/crear base de datos IndexedDB
    const dbName = 'zkidentity'
    const storeName = 'fragments'

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1)

      request.onerror = () => reject(new Error('Error abriendo IndexedDB'))

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' })
        }
      }

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)

        const data = {
          id: `${userId}_frag_${fragment.index}`,
          fragment,
          timestamp: Date.now()
        }

        const addRequest = store.put(data)

        addRequest.onsuccess = () => {
          resolve({
            success: true,
            location: 'local',
            fragmentId: data.id
          })
        }

        addRequest.onerror = () => {
          reject(new Error('Error guardando en IndexedDB'))
        }
      }
    })
  } catch (error) {
    return {
      success: false,
      location: 'local',
      fragmentId: '',
      error: error.message
    }
  }
}

/**
 * Guarda un fragmento en Supabase
 */
export async function saveToSupabase(
  fragment: Fragment,
  userId: string
): Promise<DistributionResult> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('fragments')
      .insert({
        user_id: userId,
        fragment_index: fragment.index,
        encrypted_data: fragment.data,
        metadata: fragment.metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      location: 'supabase',
      fragmentId: data.id
    }
  } catch (error) {
    return {
      success: false,
      location: 'supabase',
      fragmentId: '',
      error: error.message
    }
  }
}

/**
 * Guarda un fragmento en Redis (Upstash) con TTL de 90 días
 */
export async function saveToRedis(
  fragment: Fragment,
  userId: string
): Promise<DistributionResult> {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL!,
      token: process.env.UPSTASH_REDIS_TOKEN!
    })

    const key = `zkidentity:${userId}:frag:${fragment.index}`
    const value = JSON.stringify(fragment)

    // TTL de 90 días en segundos
    const ttl = 90 * 24 * 60 * 60

    await redis.set(key, value, { ex: ttl })

    return {
      success: true,
      location: 'redis',
      fragmentId: key
    }
  } catch (error) {
    return {
      success: false,
      location: 'redis',
      fragmentId: '',
      error: error.message
    }
  }
}

/**
 * Guarda un fragmento en Stellar como Data Entry
 */
export async function saveToStellar(
  fragment: Fragment,
  userId: string,
  stellarPublicKey: string
): Promise<DistributionResult> {
  try {
    // Esta función la implementará más tarde cuando integres con Stellar
    // Por ahora, placeholder
    const { storeDataEntry } = await import('@zk-identity/stellar-utils')

    const dataKey = `zkfrag${fragment.index}`
    const result = await storeDataEntry(stellarPublicKey, dataKey, fragment.data)

    return {
      success: true,
      location: 'stellar',
      fragmentId: `${stellarPublicKey}:${dataKey}`
    }
  } catch (error) {
    return {
      success: false,
      location: 'stellar',
      fragmentId: '',
      error: error.message
    }
  }
}

/**
 * Guarda un fragmento en IPFS (web3.storage)
 */
export async function saveToIPFS(
  fragment: Fragment,
  userId: string
): Promise<DistributionResult> {
  try {
    // Usaremos fetch para subir a web3.storage
    const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN

    if (!token) {
      throw new Error('Web3.storage token no configurado')
    }

    // Crear blob con el fragmento
    const blob = new Blob([JSON.stringify(fragment)], { type: 'application/json' })
    const file = new File([blob], `fragment_${fragment.index}.json`)

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error('Error subiendo a IPFS')
    }

    const data = await response.json()
    const cid = data.cid

    return {
      success: true,
      location: 'ipfs',
      fragmentId: cid
    }
  } catch (error) {
    return {
      success: false,
      location: 'ipfs',
      fragmentId: '',
      error: error.message
    }
  }
}

/**
 * Distribuye todos los fragmentos a sus ubicaciones correspondientes
 */
export async function distributeFragments(
  fragments: string[],
  userId: string,
  stellarPublicKey: string
): Promise<DistributionResult[]> {
  const distributionFunctions = [
    (frag: Fragment) => saveToIndexedDB(frag, userId),
    (frag: Fragment) => saveToStellar(frag, userId, stellarPublicKey),
    (frag: Fragment) => saveToSupabase(frag, userId),
    (frag: Fragment) => saveToRedis(frag, userId),
    (frag: Fragment) => saveToIPFS(frag, userId)
  ]

  const locations: Fragment['location'][] = ['local', 'stellar', 'supabase', 'redis', 'ipfs']

  const results = await Promise.all(
    fragments.map((fragmentData, index) => {
      const fragment: Fragment = {
        index,
        data: fragmentData,
        location: locations[index],
        metadata: {
          id: `frag_${index}_${Date.now()}`,
          createdAt: new Date().toISOString(),
          threshold: 3,
          totalFragments: 5
        }
      }

      return distributionFunctions[index](fragment)
    })
  )

  return results
}
```

#### Paso 4: Reconstrucción de Datos

**Archivo**: `packages/crypto/reconstruction.ts`

```typescript
import { Fragment, DistributionResult } from './distribution'
import { reconstructFromShares } from './shamir'
import { decryptData } from './encryption'

/**
 * Recupera un fragmento de IndexedDB
 */
export async function retrieveFromIndexedDB(
  userId: string,
  fragmentIndex: number
): Promise<string | null> {
  return new Promise((resolve) => {
    const request = indexedDB.open('zkidentity', 1)

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = db.transaction(['fragments'], 'readonly')
      const store = transaction.objectStore('fragments')
      const getRequest = store.get(`${userId}_frag_${fragmentIndex}`)

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          resolve(getRequest.result.fragment.data)
        } else {
          resolve(null)
        }
      }

      getRequest.onerror = () => resolve(null)
    }

    request.onerror = () => resolve(null)
  })
}

/**
 * Recupera un fragmento de Supabase
 */
export async function retrieveFromSupabase(
  userId: string,
  fragmentIndex: number
): Promise<string | null> {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('fragments')
      .select('encrypted_data')
      .eq('user_id', userId)
      .eq('fragment_index', fragmentIndex)
      .single()

    if (error || !data) return null

    return data.encrypted_data
  } catch {
    return null
  }
}

/**
 * Recupera un fragmento de Redis
 */
export async function retrieveFromRedis(
  userId: string,
  fragmentIndex: number
): Promise<string | null> {
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL!,
      token: process.env.UPSTASH_REDIS_TOKEN!
    })

    const key = `zkidentity:${userId}:frag:${fragmentIndex}`
    const value = await redis.get(key)

    if (!value) return null

    const fragment = JSON.parse(value as string)
    return fragment.data
  } catch {
    return null
  }
}

/**
 * Intenta recuperar fragmentos de todas las ubicaciones
 * y reconstruir los datos originales
 */
export async function reconstructUserData(
  userId: string,
  encryptionKey: string,
  iv: string,
  authTag: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Intentar recuperar de todas las ubicaciones
    const fragments: (string | null)[] = await Promise.all([
      retrieveFromIndexedDB(userId, 0),
      // retrieveFromStellar(userId, 1),  // Implementar cuando Stellar esté listo
      retrieveFromSupabase(userId, 2),
      retrieveFromRedis(userId, 3),
      // retrieveFromIPFS(userId, 4),     // Implementar cuando IPFS esté listo
    ])

    // Filtrar fragmentos válidos (no null)
    const validFragments = fragments.filter((f): f is string => f !== null)

    if (validFragments.length < 3) {
      return {
        success: false,
        error: `Solo se recuperaron ${validFragments.length} fragmentos. Se necesitan al menos 3.`
      }
    }

    // Reconstruir secreto usando Shamir
    const encryptedData = reconstructFromShares(validFragments.slice(0, 3))

    // Desencriptar datos
    const decryptedData = decryptData(encryptedData, encryptionKey, iv, authTag)

    // Parsear JSON
    const userData = JSON.parse(decryptedData)

    return {
      success: true,
      data: userData
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
```

#### Paso 5: Función Principal de Todo el Flujo

**Archivo**: `packages/crypto/index.ts`

```typescript
import { generateEncryptionKey, encryptData, decryptData, hashData } from './encryption'
import { createShamirShares, reconstructFromShares } from './shamir'
import { distributeFragments, DistributionResult } from './distribution'
import { reconstructUserData } from './reconstruction'

export interface DNIData {
  nombre: string
  apellido: string
  dni: string
  fechaNacimiento: string
  nacionalidad: string
}

export interface EncryptionResult {
  success: boolean
  key: string
  iv: string
  authTag: string
  distributionResults: DistributionResult[]
  error?: string
}

/**
 * Función principal: Encripta, fragmenta y distribuye datos de DNI
 */
export async function protectUserData(
  dniData: DNIData,
  userId: string,
  stellarPublicKey: string
): Promise<EncryptionResult> {
  try {
    // 1. Generar clave de encriptación
    const encryptionKey = generateEncryptionKey()

    // 2. Convertir datos a JSON string
    const dataString = JSON.stringify(dniData)

    // 3. Encriptar datos
    const { encryptedData, iv, authTag } = encryptData(dataString, encryptionKey)

    // 4. Crear fragmentos con Shamir (3 de 5)
    const fragments = createShamirShares(encryptedData, 5, 3)

    // 5. Distribuir fragmentos
    const distributionResults = await distributeFragments(
      fragments,
      userId,
      stellarPublicKey
    )

    // 6. Verificar que al menos 3 se guardaron exitosamente
    const successfulDistributions = distributionResults.filter(r => r.success).length

    if (successfulDistributions < 3) {
      throw new Error(
        `Solo se guardaron ${successfulDistributions} fragmentos exitosamente. Se necesitan al menos 3.`
      )
    }

    return {
      success: true,
      key: encryptionKey,
      iv,
      authTag,
      distributionResults
    }
  } catch (error) {
    return {
      success: false,
      key: '',
      iv: '',
      authTag: '',
      distributionResults: [],
      error: error.message
    }
  }
}

/**
 * Función de recuperación: Recons truye datos desde fragmentos
 */
export async function retrieveUserData(
  userId: string,
  encryptionKey: string,
  iv: string,
  authTag: string
): Promise<{ success: boolean; data?: DNIData; error?: string }> {
  return reconstructUserData(userId, encryptionKey, iv, authTag)
}

// Re-exportar funciones útiles
export {
  generateEncryptionKey,
  encryptData,
  decryptData,
  hashData,
  createShamirShares,
  reconstructFromShares,
  distributeFragments
}
```

### Base de Datos (Supabase)

Necesitas crear las tablas en Supabase:

#### Schema SQL

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stellar_pubkey TEXT NOT NULL UNIQUE,
  biometric_id TEXT,
  kyc_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de fragmentos
CREATE TABLE fragments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fragment_index INTEGER NOT NULL,
  encrypted_data TEXT NOT NULL,
  metadata JSONB,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, fragment_index)
);

-- Tabla de pruebas ZK
CREATE TABLE proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  proof_type TEXT NOT NULL, -- 'age', 'nationality', 'identity'
  proof_hash TEXT NOT NULL,
  public_signals JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor performance
CREATE INDEX idx_fragments_user_id ON fragments(user_id);
CREATE INDEX idx_proofs_user_id ON proofs(user_id);
CREATE INDEX idx_users_stellar_pubkey ON users(stellar_pubkey);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (los usuarios solo pueden ver sus propios datos)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own fragments" ON fragments
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own fragments" ON fragments
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own proofs" ON proofs
  FOR SELECT USING (auth.uid()::text = user_id::text);
```

### Cómo Probar Tu Trabajo

#### Test 1: Encriptación Básica

```typescript
// Test en Node.js o en browser console
import { encryptData, decryptData, generateEncryptionKey } from '@zk-identity/crypto'

const key = generateEncryptionKey()
console.log('Clave generada:', key)

const data = "Datos secretos del DNI"
const { encryptedData, iv, authTag } = encryptData(data, key)
console.log('Encriptado:', encryptedData)

const decrypted = decryptData(encryptedData, key, iv, authTag)
console.log('Desencriptado:', decrypted)
console.log('¿Son iguales?', data === decrypted) // Debe ser true
```

#### Test 2: Shamir Secret Sharing

```typescript
import { createShamirShares, reconstructFromShares } from '@zk-identity/crypto'

const secret = "mi_secreto_super_importante"
const shares = createShamirShares(secret, 5, 3)
console.log('5 fragmentos creados:', shares)

// Reconstruir con 3 fragmentos
const recovered1 = reconstructFromShares([shares[0], shares[1], shares[2]])
console.log('Recuperado con [0,1,2]:', recovered1)
console.log('¿Es correcto?', recovered1 === secret)

// Reconstruir con otros 3 fragmentos
const recovered2 = reconstructFromShares([shares[1], shares[3], shares[4]])
console.log('Recuperado con [1,3,4]:', recovered2)
console.log('¿Es correcto?', recovered2 === secret)

// Intentar con solo 2 (debe fallar o dar basura)
try {
  const recovered3 = reconstructFromShares([shares[0], shares[1]])
  console.log('Con 2 fragmentos:', recovered3)
  console.log('¿Es correcto?', recovered3 === secret) // Debe ser false
} catch (error) {
  console.log('Error con 2 fragmentos (esperado):', error.message)
}
```

#### Test 3: Flujo Completo

```typescript
import { protectUserData, retrieveUserData } from '@zk-identity/crypto'

const dniData = {
  nombre: 'Juan',
  apellido: 'Pérez',
  dni: '12345678',
  fechaNacimiento: '1990-01-01',
  nacionalidad: 'Argentina'
}

const userId = 'user_123'
const stellarPublicKey = 'GXXXXX...'

// Proteger datos
const result = await protectUserData(dniData, userId, stellarPublicKey)

if (result.success) {
  console.log('✅ Datos protegidos exitosamente')
  console.log('Distribución:', result.distributionResults)

  // Guardar estos valores (simularías que el usuario los tiene)
  const { key, iv, authTag } = result

  // Recuperar datos
  const retrieved = await retrieveUserData(userId, key, iv, authTag)

  if (retrieved.success) {
    console.log('✅ Datos recuperados:', retrieved.data)
    console.log('¿Son iguales?', JSON.stringify(dniData) === JSON.stringify(retrieved.data))
  } else {
    console.log('❌ Error recuperando:', retrieved.error)
  }
} else {
  console.log('❌ Error protegiendo datos:', result.error)
}
```

### Integración con el Trabajo de Tus Compañeras

#### Con Isa (Cámara):
Ella te pasará los datos del DNI extraídos:

```typescript
// En el componente de Isa
const dniData = {
  nombre: 'María',
  apellido: 'González',
  dni: '98765432',
  fechaNacimiento: '1995-05-15',
  nacionalidad: 'Argentina'
}

// Ella llama a tu función
import { protectUserData } from '@zk-identity/crypto'
const result = await protectUserData(dniData, userId, stellarPublicKey)
```

#### Con Karu (Biométrico):
Ella generará un ID biométrico que también debes proteger:

```typescript
// El ID biométrico también es sensible
const biometricId = 'bio_hash_abc123...'

// También lo encriptas y fragmentas
const biometricData = { biometricId }
const result = await protectUserData(biometricData, userId, stellarPublicKey)
```

#### Con Angie (Frontend):
Ella mostrará el estado de la distribución en la UI:

```typescript
// Angie usa tus funciones y muestra loading states
<FragmentationStep>
  {distributionResults.map(result => (
    <div>
      {result.location}: {result.success ? '✅' : '❌'}
    </div>
  ))}
</FragmentationStep>
```

#### Con Anouk (ZK Circuits):
Los datos encriptados se usan para generar pruebas:

```typescript
// Primero desencriptas
const { data: dniData } = await retrieveUserData(userId, key, iv, authTag)

// Luego Anouk genera pruebas con los datos desencriptados
import { generateAgeProof } from '@zk-identity/zk-circuits'
const ageProof = await generateAgeProof(new Date(dniData.fechaNacimiento))
```

### Variables de Entorno Necesarias

Crea un archivo `.env.local` en el root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Upstash Redis
UPSTASH_REDIS_URL=https://tu-redis.upstash.io
UPSTASH_REDIS_TOKEN=tu_token_aqui

# Web3.storage (IPFS)
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=tu_token_aqui
```

### Checklist de Tareas

**Encriptación**:
- [ ] Implementar `generateEncryptionKey()`
- [ ] Implementar `encryptData()` con AES-256-GCM
- [ ] Implementar `decryptData()`
- [ ] Implementar `hashData()` con SHA-256
- [ ] Tests unitarios de encriptación

**Shamir Secret Sharing**:
- [ ] Implementar `createShamirShares()` (3 de 5)
- [ ] Implementar `reconstructFromShares()`
- [ ] Tests de fragmentación y reconstrucción
- [ ] Verificar que con 2 fragmentos no se puede reconstruir

**Distribución**:
- [ ] Implementar `saveToIndexedDB()`
- [ ] Implementar `saveToSupabase()`
- [ ] Implementar `saveToRedis()`
- [ ] Implementar `saveToStellar()` (placeholder)
- [ ] Implementar `saveToIPFS()`
- [ ] Implementar `distributeFragments()`
- [ ] Manejar errores en cada ubicación

**Reconstrucción**:
- [ ] Implementar `retrieveFromIndexedDB()`
- [ ] Implementar `retrieveFromSupabase()`
- [ ] Implementar `retrieveFromRedis()`
- [ ] Implementar `reconstructUserData()`
- [ ] Verificar recuperación con diferentes combinaciones de 3 fragmentos

**Base de Datos**:
- [ ] Crear proyecto en Supabase
- [ ] Ejecutar schema SQL
- [ ] Configurar Row Level Security
- [ ] Probar inserts y selects

**Integración**:
- [ ] Función `protectUserData()` completa
- [ ] Función `retrieveUserData()` completa
- [ ] Export de todas las funciones necesarias
- [ ] Documentación de tipos TypeScript

### Recursos y Referencias

**Cryptografía**:
- [Node.js Crypto Docs](https://nodejs.org/api/crypto.html)
- [AES-GCM Explained](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [Shamir Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing)
- [secrets.js Documentation](https://github.com/grempe/secrets.js)

**Bases de Datos**:
- [Supabase Docs](https://supabase.com/docs)
- [Upstash Redis Docs](https://docs.upstash.com/redis)
- [Web3.storage Docs](https://web3.storage/docs/)

**IndexedDB**:
- [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

### Consejos Finales

1. **Seguridad primero**: Nunca logguees claves de encriptación o datos sensibles
2. **Testing exhaustivo**: Prueba todos los casos edge (fragmentos faltantes, claves incorrectas, etc.)
3. **Error handling**: Siempre maneja errores gracefully, especialmente en red
4. **Performance**: La encriptación puede ser lenta, considera usar Web Workers
5. **Documentación**: Documenta bien cada función, tus compañeras dependen de ti

### Debugging Tips

Si algo no funciona:

1. **Verifica claves**: Las claves deben ser hex strings de exactamente 64 caracteres (32 bytes)
2. **IV y AuthTag**: Deben guardarse junto con los datos encriptados
3. **Fragmentos**: Verifica que sean exactamente 5 y que todos sean strings válidos
4. **Threshold**: Con menos de 3 fragmentos, NO se puede reconstruir (es matemáticamente imposible)
5. **Base de datos**: Usa Supabase Table Editor para verificar que los datos se guardan

¡Mucha suerte Denisse! Tú eres la última línea de defensa de la privacidad de los usuarios. Tu trabajo es crítico para el éxito del proyecto. 🔐✨
