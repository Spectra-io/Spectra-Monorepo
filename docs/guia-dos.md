# **Guía Completa: Mock Data + Threshold Encryption para ZK Identity Stellar**

## **📋 Resumen Ejecutivo**

Esta guía detalla la implementación de dos componentes críticos para el hackathon de Stellar:
1. **Mock Camera Component**: Generación de datos DNI argentinos aleatorios y realistas
2. **Threshold Encryption System**: Protección de datos mediante Shamir Secret Sharing (3-of-5)

Los datos cruciales a proteger son: nombre, nacionalidad, mayoría de edad y hash biométrico.

---

## **🎯 Arquitectura del Sistema**

### **Flujo de Datos**

```
[Mock Camera] → [Datos DNI] → [Encriptación AES-256] → [Shamir 3-of-5] → [Distribución]
     ↓              ↓                    ↓                    ↓                ↓
  Captura      Extracción         Protección         Fragmentación      5 Ubicaciones
```

### **Datos Generados**

```typescript
{
  nombre: "María",                    // Random de lista argentina
  apellido: "González",                // Random de lista argentina
  dni: "38456789",                    // Correlacionado con edad
  fechaNacimiento: "1995-03-15",      // Garantiza >18 años
  nacionalidad: "Argentina",           // SIEMPRE fijo
  edad: 29,                           // Calculado
  esMayorDeEdad: true,                // Siempre true
  huellaHash: "a3f5b8c9d2e1f6a7...", // SHA-256 simulado
  timestamp: "2024-01-15T10:30:00Z"
}
```

---

## **🔧 Implementación Técnica**

### **1. Estructura de Archivos del Proyecto**

```
zk-identity-stellar/
├── apps/web/components/
│   ├── camera/
│   │   ├── MockCamera.tsx          # UI del componente
│   │   ├── MockDataGenerator.ts    # Lógica de generación
│   │   └── types.ts                # Interfaces TypeScript
│   │
├── packages/crypto/
│   ├── encryption.ts               # AES-256-GCM
│   ├── shamir.ts                   # Secret Sharing
│   ├── distribution.ts             # Distribución a 5 lugares
│   ├── reconstruction.ts           # Recuperación de datos
│   ├── types.ts                    # Interfaces
│   └── index.ts                    # Exports principales
```

### **2. Mock Data Generator - Lógica Core**

#### **Datos Base Argentinos**

```typescript
// Nombres y apellidos más comunes en Argentina
const NOMBRES_MASCULINOS = [
  'Juan', 'Carlos', 'Miguel', 'Diego', 'Luis', 
  'José', 'Ricardo', 'Jorge', 'Alberto', 'Martín'
]

const NOMBRES_FEMENINOS = [
  'María', 'Ana', 'Laura', 'Sofía', 'Valentina',
  'Lucía', 'Paula', 'Carla', 'Julia', 'Florencia'
]

const APELLIDOS_ARGENTINOS = [
  'González', 'Rodríguez', 'García', 'Fernández', 'López',
  'Martínez', 'Pérez', 'Sánchez', 'Romero', 'Torres'
]
```

#### **Generación de DNI Realista**

```typescript
function generateDNI(edad: number): string {
  // DNIs argentinos correlacionados con edad
  const currentYear = new Date().getFullYear()
  const birthYear = currentYear - edad
  
  // Rangos realistas según generación
  if (birthYear < 1970) return (5000000 + Math.random() * 5000000).toFixed(0)
  if (birthYear < 1980) return (10000000 + Math.random() * 5000000).toFixed(0)
  if (birthYear < 1990) return (20000000 + Math.random() * 8000000).toFixed(0)
  if (birthYear < 2000) return (28000000 + Math.random() * 7000000).toFixed(0)
  return (35000000 + Math.random() * 10000000).toFixed(0)
}
```

#### **Hash Biométrico Simulado**

```typescript
async function generateFingerprintHash(dni: string): Promise<string> {
  const data = `fingerprint_${dni}_${Date.now()}`
  const encoder = new TextEncoder()
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
```

### **3. Threshold Encryption con Shamir**

#### **Conceptos Clave**

| Aspecto | Valor | Razón |
|---------|-------|-------|
| **Fragmentos Totales** | 5 | Distribución en múltiples lugares |
| **Threshold Mínimo** | 3 | Balance entre seguridad y disponibilidad |
| **Encriptación** | AES-256-GCM | Estándar industria, incluye autenticación |
| **Hashing** | SHA-256 | Para fingerprint y verificación |

#### **Proceso de Encriptación**

```typescript
// 1. Generar clave segura
const encryptionKey = crypto.getRandomValues(new Uint8Array(32))

// 2. Encriptar datos
const encryptedData = await encryptData(
  JSON.stringify(dniData),
  encryptionKey
)

// 3. Crear 5 fragmentos (necesitas 3 para reconstruir)
const fragments = createShamirShares(encryptedData, 5, 3)

// 4. Distribuir fragmentos
fragments[0] → IndexedDB (navegador local)
fragments[1] → Stellar (Data Entry on-chain)
fragments[2] → Supabase (PostgreSQL)
fragments[3] → Redis (TTL 90 días)
fragments[4] → IPFS (permanente)
```

### **4. Distribución de Fragmentos**

#### **Ubicaciones y Características**

| Ubicación | Tipo | Persistencia | Ventajas | Riesgos |
|-----------|------|--------------|----------|---------|
| **IndexedDB** | Local | Hasta borrar caché | Rápido, sin red | Usuario puede perder |
| **Stellar** | On-chain | Permanente | Inmutable, público | Gas fees |
| **Supabase** | Cloud DB | Permanente | Queries, backups | Centralizado |
| **Redis** | Cache | 90 días | Ultra rápido | Temporal |
| **IPFS** | P2P | Permanente* | Descentralizado | Requiere pinning |

### **5. Recuperación de Datos**

```typescript
// Necesitas MÍNIMO 3 de 5 fragmentos
async function recoverData(userId: string, encryptionKey: string) {
  // Intentar recuperar de todas las fuentes
  const fragments = await Promise.allSettled([
    getFromIndexedDB(userId),
    getFromStellar(userId),
    getFromSupabase(userId),
    getFromRedis(userId),
    getFromIPFS(userId)
  ])
  
  // Filtrar fragmentos válidos
  const validFragments = fragments
    .filter(f => f.status === 'fulfilled')
    .map(f => f.value)
  
  if (validFragments.length < 3) {
    throw new Error('Insuficientes fragmentos para recuperar datos')
  }
  
  // Reconstruir con Shamir
  const encryptedData = reconstructFromShares(validFragments.slice(0, 3))
  
  // Desencriptar
  return decryptData(encryptedData, encryptionKey)
}
```

---

## **💻 Código de Implementación Completo**

### **MockDataGenerator.ts - Implementación Completa**

```typescript
import { MockDNIData } from './types'

export class MockDataGenerator {
  private static readonly NOMBRES_M = ['Juan', 'Carlos', 'Miguel', 'Diego', 'Luis']
  private static readonly NOMBRES_F = ['María', 'Ana', 'Laura', 'Sofía', 'Valentina']
  private static readonly APELLIDOS = ['González', 'Rodríguez', 'García', 'Fernández', 'López']
  
  /**
   * Genera un conjunto completo de datos DNI mock
   */
  static async generate(): Promise<MockDNIData> {
    const isFemenino = Math.random() > 0.5
    const nombres = isFemenino ? this.NOMBRES_F : this.NOMBRES_M
    
    const nombre = nombres[Math.floor(Math.random() * nombres.length)]
    const apellido = this.APELLIDOS[Math.floor(Math.random() * this.APELLIDOS.length)]
    
    // Edad entre 18 y 65 años
    const edad = Math.floor(Math.random() * 47) + 18
    const fechaNacimiento = this.generateBirthDate(edad)
    const dni = this.generateDNI(edad)
    
    // Hash biométrico único
    const huellaHash = await this.generateFingerprintHash(dni)
    
    return {
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      nacionalidad: 'Argentina' as const,
      edad,
      esMayorDeEdad: true,
      huellaHash,
      timestamp: new Date()
    }
  }
  
  private static generateBirthDate(edad: number): string {
    const currentYear = new Date().getFullYear()
    const birthYear = currentYear - edad
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
    return `${birthYear}-${month}-${day}`
  }
  
  private static generateDNI(edad: number): string {
    const birthYear = new Date().getFullYear() - edad
    let base: number
    
    if (birthYear < 1970) base = 5000000
    else if (birthYear < 1980) base = 15000000
    else if (birthYear < 1990) base = 25000000
    else if (birthYear < 2000) base = 32000000
    else base = 40000000
    
    return String(base + Math.floor(Math.random() * 3000000))
  }
  
  private static async generateFingerprintHash(dni: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(`biometric_${dni}_${Date.now()}`)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }
}
```

### **ThresholdEncryption.ts - Sistema Completo**

```typescript
import * as secrets from 'secrets.js-34r7h'

export class ThresholdEncryption {
  private static readonly TOTAL_SHARES = 5
  private static readonly THRESHOLD = 3
  
  /**
   * Pipeline completo de protección de datos
   */
  static async protectData(data: any): Promise<ProtectionResult> {
    // 1. Serializar datos
    const jsonData = JSON.stringify(data)
    
    // 2. Generar clave de encriptación
    const encryptionKey = this.generateKey()
    
    // 3. Encriptar con AES-256-GCM
    const { encrypted, iv, authTag } = await this.encrypt(jsonData, encryptionKey)
    
    // 4. Fragmentar con Shamir
    const fragments = this.createShares(encrypted)
    
    // 5. Distribuir fragmentos
    const distribution = await this.distribute(fragments)
    
    return {
      encryptionKey,
      iv,
      authTag,
      distribution
    }
  }
  
  private static generateKey(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return this.bufferToHex(array)
  }
  
  private static async encrypt(data: string, keyHex: string) {
    const key = this.hexToBuffer(keyHex)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw', key,
      { name: 'AES-GCM', length: 256 },
      false, ['encrypt']
    )
    
    const encoder = new TextEncoder()
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoder.encode(data)
    )
    
    return {
      encrypted: this.bufferToHex(new Uint8Array(encrypted)),
      iv: this.bufferToHex(iv),
      authTag: this.bufferToHex(new Uint8Array(encrypted).slice(-16))
    }
  }
  
  private static createShares(secret: string): string[] {
    return secrets.share(secret, this.TOTAL_SHARES, this.THRESHOLD)
  }
  
  private static async distribute(fragments: string[]): Promise<DistributionMap> {
    return {
      indexedDB: fragments[0],
      stellar: fragments[1],
      supabase: fragments[2],
      redis: fragments[3],
      ipfs: fragments[4]
    }
  }
  
  /**
   * Recuperación de datos protegidos
   */
  static async recoverData(
    fragments: string[], 
    encryptionKey: string,
    iv: string,
    authTag: string
  ): Promise<any> {
    // Necesitamos mínimo 3 fragmentos
    if (fragments.length < this.THRESHOLD) {
      throw new Error(`Insuficientes fragmentos: ${fragments.length}/${this.THRESHOLD}`)
    }
    
    // Reconstruir secreto
    const encrypted = secrets.combine(fragments.slice(0, this.THRESHOLD))
    
    // Desencriptar
    const decrypted = await this.decrypt(encrypted, encryptionKey, iv, authTag)
    
    return JSON.parse(decrypted)
  }
  
  private static bufferToHex(buffer: Uint8Array): string {
    return Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('')
  }
  
  private static hexToBuffer(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
    }
    return bytes
  }
}
```

---

## **🚀 Guía de Implementación con Claude Code**

### **Prompt para Claude Code**

```markdown
Necesito implementar un sistema de Mock Data + Threshold Encryption para un hackathon de Stellar. 

REQUISITOS:
1. Generar datos mock de DNI argentino (nombre, apellido, dni, fecha nacimiento, nacionalidad="Argentina", hash biométrico)
2. Garantizar que todos sean mayores de 18 años
3. Encriptar datos con AES-256-GCM
4. Fragmentar con Shamir Secret Sharing (3 de 5)
5. Distribuir fragmentos en: IndexedDB, Stellar, Supabase, Redis, IPFS

ESTRUCTURA:
- apps/web/components/camera/MockCamera.tsx (componente UI)
- apps/web/components/camera/MockDataGenerator.ts (generación datos)
- packages/crypto/encryption.ts (AES-256)
- packages/crypto/shamir.ts (secret sharing)
- packages/crypto/distribution.ts (distribución 5 lugares)

USA:
- React con TypeScript
- Shadcn/ui para componentes
- secrets.js-34r7h para Shamir
- Web Crypto API para encriptación
- Datos realistas argentinos
```

---

## **📊 Tabla de Decisiones de Diseño**

| Decisión | Opción Elegida | Alternativas | Justificación |
|----------|----------------|--------------|---------------|
| **Mock Data** | Generación aleatoria | API externa, datos fijos | Rápido para hackathon, sin dependencias |
| **Threshold** | 3 de 5 | 2 de 3, 4 de 7 | Balance óptimo seguridad/disponibilidad |
| **Encriptación** | AES-256-GCM | RSA, ChaCha20 | Estándar, rápido, incluye autenticación |
| **Fragmentación** | Shamir | Threshold RSA, MPC | Matemáticamente probado, simple |
| **Hash Biométrico** | SHA-256 | SHA-512, Argon2 | Suficiente para mock, nativo en browser |

---

## **✅ Checklist de Implementación**

### **Mock Data Generator**
- [ ] Listas de nombres/apellidos argentinos
- [ ] Generador de DNI correlacionado con edad
- [ ] Fecha nacimiento garantizando >18 años
- [ ] Hash SHA-256 para huella simulada
- [ ] Nacionalidad siempre "Argentina"

### **Threshold Encryption**
- [ ] Generación de clave AES-256 segura
- [ ] Encriptación con IV y AuthTag
- [ ] Shamir 3-of-5 splitting
- [ ] Helpers hex/buffer conversion

### **Distribution System**
- [ ] Guardar en IndexedDB
- [ ] Integración Stellar Data Entry
- [ ] Conexión Supabase
- [ ] Redis con TTL
- [ ] Upload a IPFS

### **UI Components**
- [ ] Vista de cámara simulada
- [ ] Loading states
- [ ] Display de datos generados
- [ ] Confirmación y retry

### **Testing**
- [ ] Generación de 100+ DNIs válidos
- [ ] Encriptación y recuperación exitosa
- [ ] Recuperación con solo 3 fragmentos
- [ ] Fallo con <3 fragmentos

---

## **🔒 Consideraciones de Seguridad**

1. **Clave de Encriptación**: Debe guardarse seguramente (derivar de password usuario o hardware wallet)
2. **Fragmentos**: Inútiles individualmente, no revelan información
3. **Threshold**: Inmutable una vez definido (siempre 3 de 5)
4. **IV y AuthTag**: Críticos para desencriptación, guardar junto con metadata
5. **Mock vs Producción**: En producción, reemplazar mock con captura real y biometría verdadera

---

## **📚 Referencias y Recursos**

- [Shamir's Secret Sharing - Wikipedia](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing)
- [Web Crypto API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [secrets.js Documentation](https://github.com/grempe/secrets.js)
- [AES-GCM Specification](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf)

---

**Última actualización**: Enero 2024 | **Versión**: 1.0 | **Hackathon**: Stellar ZK Identity