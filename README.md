# ZK Identity Stellar

Sistema de identidad con Zero Knowledge Proofs para Stellar Network.

## Descripción

Plataforma de identidad digital que permite a los usuarios realizar KYC una vez y generar pruebas Zero Knowledge reutilizables para múltiples anchors de Stellar, sin revelar datos personales.

### Características principales

- **KYC único**: Captura de documento (DNI) y biometría (huella/WebAuthn)
- **Pruebas ZK**: Generación de pruebas que demuestran edad, nacionalidad e identidad única
- **Privacy-first**: Datos encriptados y fragmentados con Shamir Secret Sharing
- **PWA Mobile-first**: Optimizado para dispositivos móviles
- **Stellar Integration**: Almacenamiento on-chain y verificación con Soroban

## Setup Inicial

### Requisitos

- Node.js >= 18
- pnpm >= 8.11.0

### Instalación

1. Instalar pnpm (si no lo tienes):
```bash
npm install -g pnpm@8.11.0
```

2. Clonar el repositorio:
```bash
git clone <repository-url>
cd Hackathon
```

3. Instalar dependencias:
```bash
pnpm install
```

4. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

5. Iniciar desarrollo:
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
.
├── apps/
│   ├── web/                    # Next.js PWA Application
│   │   ├── app/               # App Router (pages & layouts)
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Shadcn/ui components
│   │   │   ├── camera/       # Camera capture component
│   │   │   ├── biometric/    # Biometric authentication
│   │   │   ├── zk/           # ZK proof generation UI
│   │   │   └── encryption/   # Encryption utilities UI
│   │   ├── lib/              # Utilities
│   │   ├── hooks/            # React hooks
│   │   └── store/            # Zustand store
│   └── contracts/             # Soroban smart contracts
│
├── packages/
│   ├── types/                 # TypeScript types compartidos
│   ├── crypto/                # Utilidades de encriptación
│   ├── zk-circuits/           # Circuitos Circom para ZK
│   └── stellar-utils/         # Helpers para Stellar
│
└── docs/                      # Documentación

```

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 con App Router
- **UI**: Tailwind CSS + Shadcn/ui
- **Estado**: Zustand
- **Web3**: Stellar SDK + Freighter
- **ZK**: SnarkJS + Circom
- **Biométrico**: WebAuthn API

### Backend
- **Runtime**: Vercel Edge Functions
- **Storage**: Supabase (PostgreSQL)
- **Cache**: Upstash Redis
- **IPFS**: web3.storage

### Blockchain
- **Red**: Stellar Testnet
- **Wallet**: Freighter
- **Smart Contracts**: Soroban (Rust)

## Comandos Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo

# Build
pnpm build            # Construye para producción

# Linting
pnpm lint             # Ejecuta linter

# Formato
pnpm format           # Formatea código con Prettier

# Limpieza
pnpm clean            # Limpia node_modules y .turbo
```

## Equipo

- **Frontend UI/UX**: Angie
- **Base de Datos & Encryption**: Denisse
- **Componente Cámara**: Isa
- **Biometría & WebAuthn**: Karu
- **Zero Knowledge Circuits**: Anouk

## Flujo de Trabajo

### 1. Onboarding (KYC)
```
Usuario → Captura DNI → Extracción datos →
→ Captura biométrica → Generación pruebas ZK →
→ Encriptación + Fragmentación → Distribución
```

### 2. Generación de Pruebas ZK
- **Age Proof**: Demuestra ser mayor de 18 años
- **Nationality Proof**: Demuestra nacionalidad argentina
- **Identity Proof**: Demuestra DNI único

### 3. Distribución de Fragmentos
Los datos se fragmentan en 5 partes (threshold 3 de 5):
1. IndexedDB (navegador)
2. Stellar Data Entry (on-chain)
3. Supabase (encrypted column)
4. Redis (TTL 90 días)
5. IPFS (encrypted + pinning)

## Variables de Entorno

Ver `.env.example` para la lista completa de variables necesarias:

- **Stellar**: Network y Horizon URL
- **Supabase**: URL y API key
- **IPFS**: Web3.storage token
- **Redis**: Upstash URL y token

## Desarrollo

### Estructura de Branches
- `main`: Código en producción
- `develop`: Código en desarrollo
- `feature/*`: Nuevas características
- `fix/*`: Correcciones de bugs

### Convenciones de Commits
```
feat: Nueva característica
fix: Corrección de bug
docs: Cambios en documentación
style: Cambios de formato
refactor: Refactorización de código
test: Añadir tests
chore: Tareas de mantenimiento
```

## Recursos

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Docs](https://soroban.stellar.org/)
- [Circom Documentation](https://docs.circom.io/)
- [SnarkJS](https://github.com/iden3/snarkjs)
- [Next.js Docs](https://nextjs.org/docs)

## Licencia

MIT

## Hackathon Timeline

### Día 1
- ✅ Setup monorepo + PWA base
- 🔄 Integración cámara + WebAuthn
- 🔄 Mock data generator

### Día 2
- ⏳ Circuitos ZK básicos
- ⏳ Integración SnarkJS
- ⏳ Stellar testnet setup

### Día 3
- ⏳ UI/UX pulido
- ⏳ Fragmentación + encriptación
- ⏳ Demo flow completo

### Día 4
- ⏳ Testing + bugs
- ⏳ Presentación + video
- ⏳ Deploy a Vercel
