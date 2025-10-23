# 🚀 Despliegue en Netlify - DondeOficial Frontend

## 📋 Preparación Completada

El frontend está completamente preparado para desplegar en Netlify con las siguientes configuraciones:

### ✅ Archivos de Configuración

1. **`netlify.toml`** - Configuración principal de Netlify
2. **`next.config.ts`** - Configuración optimizada de Next.js
3. **`DEPLOYMENT.md`** - Guía detallada de despliegue
4. **`package-production.json`** - Configuración de dependencias

### 🔧 Configuraciones Incluidas

- **Build optimizado** para Next.js
- **Headers de seguridad** configurados
- **Cache optimizado** para assets estáticos
- **Redirecciones SPA** configuradas
- **Variables de entorno** preparadas

## 🌐 Pasos para Desplegar

### 1. Conectar Repositorio
1. Ve a [Netlify](https://netlify.com)
2. Haz clic en "New site from Git"
3. Conecta tu repositorio de GitHub/GitLab

### 2. Configurar Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `18`

### 3. Configurar Variables de Entorno
En Netlify Dashboard > Site Settings > Environment Variables:

```
NEXT_PUBLIC_API_URL=https://tu-backend-api.netlify.app/api
NEXT_PUBLIC_SITE_URL=https://tu-sitio.netlify.app
```

### 4. Desplegar
- Haz clic en "Deploy site"
- Netlify construirá y desplegará automáticamente

## 🔗 URLs Importantes

- **Frontend**: `https://tu-sitio.netlify.app`
- **Backend API**: `https://tu-backend-api.netlify.app/api`

## ⚠️ Notas Importantes

1. **Backend requerido**: Asegúrate de que tu backend esté desplegado y accesible
2. **CORS**: El backend debe permitir requests desde tu dominio de Netlify
3. **Variables de entorno**: Actualiza `NEXT_PUBLIC_API_URL` con la URL real de tu backend

## 🎯 Funcionalidades Incluidas

- ✅ Diseño responsive y profesional
- ✅ Sistema de búsqueda avanzado
- ✅ Navegación completa
- ✅ Componentes optimizados
- ✅ SEO optimizado
- ✅ Performance optimizado

## 📞 Soporte

Si tienes problemas con el despliegue, revisa:
1. Los logs de build en Netlify
2. Las variables de entorno
3. La conectividad con el backend
4. La configuración de CORS en el backend
