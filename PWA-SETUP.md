# Configuración PWA para Play Store

## ✅ Lo que ya está configurado

### 1. Manifest.json ✅
- Archivo creado en `/public/manifest.json`
- Configurado para PWA con soporte mobile
- Incluye shortcuts y share target

### 2. Service Worker ✅
- Archivo creado en `/public/sw.js`
- Cache strategy implementada
- Soporte offline

### 3. PWA Installer Component ✅
- Componente creado en `/src/components/PWAInstaller.tsx`
- Botón de instalación automático
- Registro de service worker

### 4. Layout configurado ✅
- Metadata para PWA agregada
- Links a manifest e iconos
- Meta tags para mobile apps

## 📋 Próximos pasos para Play Store

### Paso 1: Crear iconos (REQUERIDO)
Necesitas crear los siguientes iconos en `/public/`:

```bash
# Usa cualquier herramienta de diseño (Canva, Figma, etc.)
# Crea estos archivos:

icon-192.png  (192x192px)
icon-512.png  (512x512px)
screenshot-desktop.png (1280x720px)
screenshot-mobile.png (640x1136px o similar)
```

### Paso 2: Usar Bubblewrap para TWA
```bash
# Instalar Bubblewrap
npm install -g @bubblewrap/cli

# Inicializar
bubblewrap init --manifest https://tu-dominio.com/manifest.json

# Build para Android
bubblewrap build

# Esto generará un archivo .aab para Play Store
```

### Paso 3: Preparar para Play Store
1. **Credenciales de firma**: Bubblewrap generará las credenciales automáticamente
2. **Iconos**: Sube icono launcher de 512x512px
3. **Screenshots**: Necesitas screenshots de la app
4. **Descripción**: "Directorio de negocios DondeOficial - Encuentra servicios en tu ciudad"

## 🚀 Comandos para desplegar

```bash
# 1. Build de la app Next.js
npm run build

# 2. Generar TWA
cd frontend
bubblewrap build

# 3. El archivo .aab estará en:
# frontend/app-release.aab

# 4. Sube ese archivo a Play Store Console
```

## 📱 Testing local

```bash
# 1. Build
npm run build

# 2. Servir con HTTPS (requerido para PWA)
npx serve -s .next -p 3000 --ssl

# 3. Abrir en Chrome DevTools
# -> Application -> Service Workers -> Verificar registro
```

## ✨ Funcionalidades PWA

- ✅ Instalable en móvil
- ✅ Funciona offline
- ✅ Actualización automática
- ✅ Shortcuts (accesos rápidos)
- ✅ Share target (compartir desde otras apps)
- ✅ Notificaciones push (listo para configurar)

## 📝 Notas importantes

1. **Iconos**: Son necesarios para que funcione. Puedes generarlos con cualquier herramienta de diseño.

2. **HTTPS**: PWA requiere HTTPS en producción.

3. **Bubblewrap**: Es la herramienta oficial de Google para crear TWA.

4. **Play Store**: Necesitas cuenta de desarrollador ($25 USD una vez).

## 🔗 Recursos

- [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Next.js PWA](https://github.com/shadowwalker/next-pwa)

