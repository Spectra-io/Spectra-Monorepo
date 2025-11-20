## **Arquitectura Técnica - Senior Fullstack Web3 Perspective**

### **Stack Principal Recomendado**

#### **Frontend (Mobile-First PWA)**
- **Framework**: Next.js 14 con App Router
- **UI**: Tailwind CSS + Shadcn/ui
- **Estado**: Zustand (más ligero que Redux)
- **Web3**: Stellar SDK + Soroban client
- **ZK**: SnarkJS (funciona en browser)
- **Cámara**: react-camera-pro
- **Biométrico**: WebAuthn API nativa

**Justificación**: Next.js da SSR/performance crucial en mobile. PWA permite instalación sin app stores. Zustand es ligero para mobile.

#### **Backend (Serverless)**
- **Runtime**: Node.js en Vercel Edge Functions
- **API**: tRPC (type-safe, eficiente)
- **ZK Circuits**: Circom (compilados pre-deploy)
- **Storage**: Supabase (PostgreSQL + Realtime)
- **Cache**: Upstash Redis
- **IPFS**: web3.storage

**Justificación**: Serverless escala automático para demos. tRPC elimina errores de tipos. Edge functions dan latencia baja global.

#### **Blockchain**
- **Red**: Stellar Testnet + Soroban
- **Wallet**: Freighter para demo
- **Smart Contracts**: Rust (Soroban)

### **Arquitectura por Capas**

```
┌─────────────────────────────────────┐
│         Progressive Web App          │
│     (Next.js + WebAuthn + Camera)    │
└────────────────┬────────────────────┘
                 │ HTTPS + JWT
┌────────────────▼────────────────────┐
│         Edge API Gateway             │
│  (Vercel Edge + tRPC + Rate Limit)   │
└────────────────┬────────────────────┘
                 │
     ┌───────────┼───────────┐
     │           │           │
┌────▼────┐ ┌───▼────┐ ┌───▼────┐
│   ZK    │ │Storage │ │Stellar │
│ Engine  │ │Service │ │Service │
└─────────┘ └────────┘ └────────┘
```

### **Flujo Técnico Detallado**

#### **Fase 1: Captura (Cliente)**
```
PWA → Camera API → Canvas → 
→ TensorFlow.js Lite (detección bordes) → 
→ Mock OCR → Structured JSON
```

**Tecnologías**:
- getUserMedia API para cámara
- Canvas API para procesamiento
- TensorFlow.js para detectar documento (opcional, da buen efecto)

#### **Fase 2: Biometría**
```
WebAuthn → PublicKeyCredential → 
→ SHA-256 hash → Unique identifier
```

**Tecnologías**:
- Navigator.credentials.create()
- ArrayBuffer para manejar datos binarios
- SubtleCrypto API para hashing

#### **Fase 3: Generación ZK**
```
Datos → WASM Prover (browser) → 
→ Proof + Public Signals → 
→ Compression → Storage
```

**Setup ZK**:
- **Circuitos**: Escritos en Circom, compilados a R1CS
- **Ceremonia**: Powers of Tau (pueden usar una existente)
- **Prover**: SnarkJS en WebAssembly
- **Verifier**: Smart contract en Soroban

**Circuitos a implementar**:
1. `age_check.circom` - Mayor de edad
2. `nationality.circom` - Nacionalidad argentina  
3. `unique_identity.circom` - DNI único

#### **Fase 4: Encriptación y Fragmentación**

```
Datos → AES-256-GCM → 
→ Shamir Secret Sharing (3 de 5) → 
→ Distribución
```

**Distribución de fragmentos**:
1. **IndexedDB** (navegador usuario)
2. **Stellar Data Entry** (on-chain)
3. **Supabase** (encrypted column)
4. **Redis** (con TTL 90 días)
5. **IPFS** (encriptado + pinning)

**Librerías**:
- `secrets.js-34r7h` para Shamir
- `tweetnacl` para encriptación
- `js-sha256` para hashing

### **Optimizaciones Mobile**

#### **Performance**:
- **Lazy load** del WASM del prover
- **Web Workers** para cálculos ZK
- **Virtual scrolling** para listas
- **Preact** en lugar de React (opcional, más ligero)

#### **UX Mobile**:
- **Viewport lock** durante captura
- **Haptic feedback** (Vibration API)
- **Offline first** con Service Workers
- **Skeleton screens** mientras carga

### **Infraestructura DevOps**

#### **Development**:
```bash
├── apps/
│   ├── web/          # Next.js PWA
│   └── contracts/    # Soroban contracts
├── packages/
│   ├── zk-circuits/  # Circom files
│   ├── types/        # TypeScript compartidos
│   └── utils/        # Helpers comunes
├── services/
│   ├── prover/       # Servicio de generación
│   └── verifier/     # Verificación off-chain
```

**Monorepo**: Turborepo (caché eficiente)
**CI/CD**: GitHub Actions → Vercel
**Monitoring**: Vercel Analytics + Sentry

### **Seguridad**

#### **Capas de seguridad**:
1. **Rate limiting** en Edge Functions
2. **CORS** estricto solo origenes permitidos
3. **CSP headers** para prevenir XSS
4. **Pruebas ZK** generadas client-side (no confiar en servidor)
5. **Timeouts** agresivos (30s max por operación)

### **Base de Datos**

```sql
-- Supabase schema simplificado
users (
  id: uuid
  stellar_pubkey: string
  created_at: timestamp
)

proofs (
  id: uuid
  user_id: fk
  proof_type: enum
  proof_hash: string
  public_signals: jsonb
  created_at: timestamp
)

fragments (
  id: uuid
  proof_id: fk
  fragment_index: int
  encrypted_data: bytea
  expires_at: timestamp
)
```

### **Stellar Integration**

**Account structure**:
```
Data Entries:
- zk_age_proof: 32 bytes
- zk_nationality_proof: 32 bytes  
- zk_identity_proof: 32 bytes
- zk_issuer: string
- zk_version: string
```

**Smart Contract** (Soroban):
- Verificador de pruebas on-chain
- Registry de issuers confiables
- Time-locked reveals para compliance

### **MVP Timeline (Hackathon)**

**Día 1**: 
- Setup monorepo + PWA base
- Integración cámara + WebAuthn
- Mock data generator

**Día 2**:
- Circuitos ZK básicos
- Integración SnarkJS
- Stellar testnet setup

**Día 3**:
- UI/UX pulido
- Fragmentación + encriptación
- Demo flow completo

**Día 4**:
- Testing + bugs
- Presentación + video
- Deploy a Vercel

### **Consideraciones Finales**

**Para escalar post-hackathon**:
- Migrar prover a servidor (más rápido)
- Implementar cola de trabajos (BullMQ)
- CDN para assets pesados (Cloudflare)
- Backup ceremonies para circuitos
- Auditoría de seguridad

**Métricas de éxito**:
- Generación de prueba < 10 segundos
- Todo el flujo < 1 minuto
- 0 datos sin encriptar en repos
- 100% mobile responsive

