# Documentación del Equipo

Esta carpeta contiene toda la documentación técnica del proyecto.

## Archivos

- **context.md**: Arquitectura técnica completa del proyecto
- **basic-guia.md**: Guía de inicialización del proyecto base

## Recursos adicionales

### Para cada desarrolladora

#### Angie (Frontend UI/UX)
- Carpeta: `apps/web/app/` y `apps/web/components/`
- Tecnologías: Next.js 14, Tailwind CSS, Shadcn/ui, Framer Motion
- Tareas: Crear interfaces, animaciones, experiencia mobile-first

#### Denisse (Base de Datos & Encryption)
- Carpeta: `packages/crypto/`
- Tecnologías: Supabase, Shamir Secret Sharing, AES-256-GCM
- Tareas: Implementar encriptación, fragmentación, almacenamiento distribuido

#### Isa (Componente Cámara)
- Carpeta: `apps/web/components/camera/`
- Tecnologías: react-camera-pro, Canvas API, getUserMedia
- Tareas: Captura de documento, detección de bordes, mock OCR

#### Karu (Biometría)
- Carpeta: `apps/web/components/biometric/`
- Tecnologías: WebAuthn API, SubtleCrypto
- Tareas: Registro biométrico, autenticación, generación de IDs únicos

#### Anouk (Zero Knowledge)
- Carpeta: `packages/zk-circuits/`
- Tecnologías: Circom, SnarkJS, WASM
- Tareas: Escribir circuitos, generar pruebas, integración browser-side

## Notas de desarrollo

### Comunicación entre packages
Todos los packages están en el monorepo y pueden importarse usando:
```typescript
import { MockDNIData } from '@zk-identity/types'
import { encryptData } from '@zk-identity/crypto'
import { connectWallet } from '@zk-identity/stellar-utils'
```

### Hot Module Replacement
Turborepo maneja el HMR automáticamente. Cualquier cambio en packages se refleja instantáneamente en la app web.

### Testing
Por ahora no hay tests configurados, pero se puede añadir Jest o Vitest si es necesario durante el hackathon.
