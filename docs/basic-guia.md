## **GUÍA PARA CLAUDE CODE - INICIALIZACIÓN DEL PROYECTO BASE**

```markdown
# Inicialización Proyecto ZK Identity Stellar - Hackathon

## CONTEXTO
Necesito crear un monorepo base para un proyecto de hackathon. Es una PWA mobile-first que implementa identidad con Zero Knowledge Proofs para Stellar. Los usuarios hacen KYC una vez (foto DNI + huella) y generan pruebas ZK reutilizables con múltiples anchors sin revelar datos personales.

## OBJETIVO
Crear la estructura base del proyecto con todas las dependencias instaladas para que 5 desarrolladoras puedan empezar a trabajar inmediatamente después de clonar el repo.

## INSTRUCCIONES PASO A PASO

### 1. CREAR ESTRUCTURA DEL MONOREPO

Crear la siguiente estructura de carpetas y archivos:

```
zk-identity-stellar/
├── apps/
│   ├── web/                    # Next.js PWA app
│   └── contracts/              # Carpeta para futuros smart contracts Soroban
├── packages/
│   ├── types/                  # TypeScript types compartidos
│   ├── crypto/                 # Utilidades de encriptación
│   ├── zk-circuits/            # Circuitos Circom para ZK proofs
│   └── stellar-utils/          # Helpers para Stellar
├── docs/
│   └── README.md              # Documentación del equipo
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions básico
├── turbo.json                 # Configuración Turborepo
├── package.json               # Root package.json
├── pnpm-workspace.yaml        # Configuración pnpm workspaces
├── .gitignore
├── .env.example
└── README.md
```

### 2. CONFIGURACIÓN DEL ROOT

**package.json (root)**:
```json
{
  "name": "zk-identity-stellar",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "start": "turbo start",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "latest",
    "prettier": "^3.1.0",
    "eslint": "^8.54.0"
  },
  "packageManager": "pnpm@8.11.0",
  "engines": {
    "node": ">=18"
  }
}
```

**turbo.json**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "clean": {
      "cache": false
    }
  }
}
```

**pnpm-workspace.yaml**:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 3. CREAR NEXT.JS APP CON TODAS LAS DEPENDENCIAS

En `apps/web/` crear una Next.js app con:

**package.json** para apps/web:
```json
{
  "name": "@zk-identity/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    
    "// UI & Styling": "",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "tailwindcss-animate": "^1.0.7",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.16",
    
    "// State Management": "",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.13.4",
    
    "// Web3 & Stellar": "",
    "@stellar/stellar-sdk": "^11.2.0",
    "@stellar/freighter-api": "^2.0.0",
    
    "// Zero Knowledge": "",
    "snarkjs": "^0.7.3",
    "circomlib": "^2.0.5",
    
    "// Encryption": "",
    "tweetnacl": "^1.0.3",
    "tweetnacl-util": "^0.15.1",
    "secrets.js-34r7h": "^2.0.0",
    "crypto-js": "^4.2.0",
    
    "// Camera & Biometrics": "",
    "react-camera-pro": "^1.3.1",
    "@simplewebauthn/browser": "^8.3.4",
    "@simplewebauthn/server": "^8.3.6",
    
    "// Database & Storage": "",
    "@supabase/supabase-js": "^2.39.1",
    "@upstash/redis": "^1.25.1",
    
    "// Utilities": "",
    "zod": "^3.22.4",
    "date-fns": "^2.30.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.4",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.17",
    "@types/crypto-js": "^4.2.1",
    "typescript": "^5.3.3",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "eslint": "^8.54.0",
    "eslint-config-next": "14.0.4"
  }
}
```

### 4. CONFIGURACIÓN DE NEXT.JS

**next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // PWA Configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
  // WebAssembly support for SnarkJS
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    }
    return config
  },
}

module.exports = nextConfig
```

**tailwind.config.ts**:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

### 5. ESTRUCTURA DE LA APP NEXT.JS

Crear en `apps/web/`:

```
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── manifest.json              # PWA manifest
├── onboarding/
│   └── page.tsx
├── dashboard/
│   └── page.tsx
└── api/
    ├── encryption/
    │   └── route.ts
    └── zk/
        └── route.ts

components/
├── ui/                        # Componentes shadcn/ui
│   ├── button.tsx
│   ├── card.tsx
│   └── dialog.tsx
├── camera/
│   └── .gitkeep
├── biometric/
│   └── .gitkeep
├── zk/
│   └── .gitkeep
└── encryption/
    └── .gitkeep

lib/
├── utils.ts                   # Utilidad cn() para Tailwind
└── constants.ts

hooks/
└── .gitkeep

store/
└── useIdentityStore.ts        # Zustand store básico
```

**app/layout.tsx** básico:
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZK Identity - Stellar',
  description: 'Zero Knowledge Identity for Stellar Anchors',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

### 6. CREAR PACKAGES COMPARTIDOS

**packages/types/package.json**:
```json
{
  "name": "@zk-identity/types",
  "version": "0.0.1",
  "main": "index.ts",
  "types": "index.ts"
}
```

**packages/types/index.ts**:
```typescript
export interface MockDNIData {
  nombre: string
  apellido: string
  dni: string
  fechaNacimiento: string
  nacionalidad: 'Argentina'
}

export interface ZKProof {
  id: string
  type: 'age' | 'nationality' | 'identity'
  proofHash: string
  publicSignals: string[]
  createdAt: Date
}

export interface EncryptedFragment {
  index: number
  data: string
  location: 'local' | 'stellar' | 'ipfs' | 'supabase'
}
```

Repetir estructura similar para:
- packages/crypto/
- packages/stellar-utils/
- packages/zk-circuits/

### 7. ARCHIVOS DE CONFIGURACIÓN

**.env.example**:
```
# Stellar
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# IPFS
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_token

# Redis/Upstash
UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token
```

**.gitignore**:
```
# Dependencies
node_modules
.pnpm-store

# Next.js
.next
out
dist

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode
.idea

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Testing
coverage

# Turbo
.turbo
```

### 8. PWA MANIFEST

**apps/web/public/manifest.json**:
```json
{
  "name": "ZK Identity Stellar",
  "short_name": "ZK ID",
  "description": "Zero Knowledge Identity for Stellar",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 9. README PRINCIPAL

**README.md**:
```markdown
# ZK Identity Stellar

Sistema de identidad con Zero Knowledge Proofs para Stellar Network.

## Setup Inicial

1. Instalar pnpm: `npm install -g pnpm@8.11.0`
2. Instalar dependencias: `pnpm install`
3. Copiar variables de entorno: `cp .env.example .env`
4. Iniciar desarrollo: `pnpm dev`

## Estructura del Proyecto

- `apps/web`: Aplicación Next.js PWA
- `packages/types`: Types compartidos
- `packages/crypto`: Utilidades de encriptación  
- `packages/zk-circuits`: Circuitos ZK
- `packages/stellar-utils`: Helpers de Stellar

## Equipo

- Frontend: Angie
- Base de Datos & Encryption: Denisse
- Componente Cámara: Isa
- Biometría: Karu
- Zero Knowledge: Anouk
```

### 10. COMANDOS FINALES

Después de crear toda la estructura, ejecutar:

```bash
# Instalar todas las dependencias
pnpm install

# Verificar que todo funciona
pnpm dev

# Inicializar git
git init
git add .
git commit -m "Initial commit: proyecto base ZK Identity Stellar"

# El repo está listo para subir a GitHub
```

## NOTAS IMPORTANTES

- Usamos pnpm para mejor manejo del monorepo
- Todas las dependencias críticas ya están incluidas
- La estructura permite que cada desarrolladora trabaje en su parte sin conflictos
- Next.js está configurado para PWA y WebAssembly (necesario para SnarkJS)
- Los placeholders (.gitkeep) mantienen la estructura de carpetas
```

Esta guía le permite a Claude Code crear todo el proyecto base desde cero con todas las dependencias y configuraciones necesarias. Una vez creado, puedes subirlo a GitHub y tus compañeras pueden clonarlo y empezar a trabajar inmediatamente con `pnpm install && pnpm dev`.