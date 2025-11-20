# Guía de Contribución - ZK Identity Stellar

## 🚀 Workflow de Desarrollo

Este proyecto usa **Git Flow** simplificado para el hackathon:

- **`main`**: Código estable y listo para producción
- **`dev`**: Rama de desarrollo donde se integran todas las features
- **`feature/*`**: Ramas individuales para cada feature

## 👩‍💻 Cómo Empezar a Trabajar

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Spectra-io/Spectra-Monorepo.git
cd Spectra-Monorepo
```

### 2. Instalar Dependencias

```bash
# Instalar pnpm si no lo tienes
npm install -g pnpm@8.11.0

# Instalar dependencias del proyecto
pnpm install
```

### 3. Iniciar Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# La app estará en http://localhost:3000
```

### 4. Leer Tu Guía

Cada miembro del equipo tiene una guía personalizada en `docs/`:

- **Angie**: `docs/guia-angie-frontend.md`
- **Denisse**: `docs/guia-denisse-database-encryption.md`
- **Isa**: `docs/guia-isa-camera.md`
- **Karu**: `docs/guia-karu-biometric.md`
- **Anouk**: `docs/context.md` (arquitectura general)

## 🌿 Crear Tu Rama de Trabajo

### Paso 1: Asegúrate de estar en `dev`

```bash
git checkout dev
git pull origin dev
```

### Paso 2: Crea tu rama personal

Usa el formato `feature/nombre-del-feature`:

```bash
# Ejemplos:
git checkout -b feature/frontend-ui        # Angie
git checkout -b feature/encryption         # Denisse
git checkout -b feature/camera-component   # Isa
git checkout -b feature/biometric-auth     # Karu
git checkout -b feature/zk-circuits        # Anouk
```

## 💻 Trabajar en Tu Feature

### Mientras Trabajas

```bash
# Ver qué archivos cambiaste
git status

# Agregar cambios al staging
git add .

# O agregar archivos específicos
git add apps/web/components/camera/CameraCapture.tsx

# Hacer commit con mensaje descriptivo
git commit -m "feat: implementar captura de documento con react-camera-pro"

# Push a tu rama
git push origin feature/tu-rama
```

### Convenciones de Commits

Usa mensajes claros con prefijos:

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (sin cambiar lógica)
- `refactor:` - Refactorización de código
- `test:` - Agregar tests
- `chore:` - Tareas de mantenimiento

**Ejemplos**:
```bash
git commit -m "feat: add camera capture component with preview"
git commit -m "fix: resolve WebAuthn browser compatibility issue"
git commit -m "docs: update biometric guide with troubleshooting"
```

## 📤 Crear Pull Request

### Método 1: Desde GitHub (Recomendado)

1. Ve a https://github.com/Spectra-io/Spectra-Monorepo
2. Verás un botón amarillo "Compare & pull request" → Click ahí
3. **IMPORTANTE**: Cambia la rama base de `main` a `dev`
4. Escribe un título descriptivo
5. En la descripción, explica qué hiciste
6. Click en "Create pull request"

### Método 2: Con URL Directa

Después de hacer push, usa esta URL (reemplaza `TU-RAMA`):

```
https://github.com/Spectra-io/Spectra-Monorepo/compare/dev...TU-RAMA?expand=1
```

### Plantilla de PR

Usa esta plantilla al crear tu PR:

```markdown
## Descripción
[Describe brevemente qué implementaste]

## Cambios Realizados
- [ ] Implementé componente X
- [ ] Agregué función Y
- [ ] Actualicé documentación

## Testing
- [ ] Probado en desarrollo local
- [ ] Probado en mobile/desktop
- [ ] No hay errores en consola

## Screenshots (si aplica)
[Agrega capturas de pantalla si es UI]

## Notas
[Cualquier información adicional para el equipo]
```

## 🔄 Mantener Tu Rama Actualizada

Si otras compañeras ya hicieron merge a `dev`, actualiza tu rama:

```bash
# Cambia a dev y actualiza
git checkout dev
git pull origin dev

# Vuelve a tu rama
git checkout feature/tu-rama

# Trae los cambios de dev a tu rama
git merge dev

# Si hay conflictos, resuélvelos y luego:
git add .
git commit -m "merge: resolve conflicts with dev"
git push origin feature/tu-rama
```

## ✅ Checklist Antes de Crear PR

- [ ] Mi código compila sin errores (`pnpm build`)
- [ ] No hay errores en consola del browser
- [ ] Probé mi componente/función localmente
- [ ] Actualicé la documentación si es necesario
- [ ] Mi rama está actualizada con `dev`
- [ ] Los commits tienen mensajes descriptivos
- [ ] El PR apunta a `dev` (NO a `main`)

## 👀 Code Review

Después de crear tu PR:

1. Avisa al equipo en el chat
2. Espera feedback (o aprobación)
3. Si hay cambios solicitados, haz los ajustes
4. Push de nuevo a tu rama (el PR se actualiza automáticamente)

## 🚨 Resolución de Conflictos

Si tu PR tiene conflictos con `dev`:

```bash
# Actualiza dev
git checkout dev
git pull origin dev

# Vuelve a tu rama
git checkout feature/tu-rama

# Merge dev en tu rama
git merge dev

# Resuelve conflictos manualmente en los archivos marcados
# Busca líneas con <<<<<<, ======, >>>>>>

# Después de resolver:
git add .
git commit -m "merge: resolve conflicts"
git push origin feature/tu-rama
```

## 🆘 Ayuda Rápida

### Descartar cambios no guardados
```bash
git checkout -- archivo.txt    # Descartar cambios en un archivo
git checkout .                 # Descartar todos los cambios
```

### Ver diferencias
```bash
git diff                       # Ver cambios sin agregar
git diff --staged              # Ver cambios en staging
```

### Ver historial
```bash
git log --oneline              # Ver commits
git log --graph --all          # Ver árbol de commits
```

### Cambiar de rama sin perder trabajo
```bash
git stash                      # Guardar cambios temporalmente
git checkout otra-rama         # Cambiar de rama
git checkout tu-rama           # Volver
git stash pop                  # Recuperar cambios
```

## 📞 Contacto

Si tienes dudas:
- Pregunta en el grupo del equipo
- Revisa tu guía en `docs/`
- Consulta la documentación técnica en `docs/context.md`

## 🎉 ¡Importante!

- **Siempre trabaja en tu propia rama** `feature/tu-nombre`
- **Nunca hagas push directo a `main` o `dev`**
- **Siempre crea PRs hacia `dev`** (no hacia `main`)
- **Comunica al equipo** cuando crees un PR
- **Haz commits frecuentes** con mensajes claros

¡Buena suerte y happy coding! 🚀
