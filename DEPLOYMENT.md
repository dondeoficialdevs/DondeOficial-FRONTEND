# Configuración para despliegue en Netlify
# DondeOficial Frontend

## Variables de Entorno Requeridas

Configura estas variables en Netlify Dashboard > Site Settings > Environment Variables:

### Obligatorias
- `NEXT_PUBLIC_API_URL`: URL de tu backend API
  - Ejemplo: `https://tu-backend-api.netlify.app/api`
  - O: `https://tu-backend.herokuapp.com/api`

### Opcionales
- `NEXT_PUBLIC_SITE_URL`: URL de tu sitio
  - Ejemplo: `https://dondeoficial.netlify.app`

## Configuración de Build

### Build Command
```bash
npm run build
```

### Publish Directory
```
.next
```

### Node Version
```
18
```

## Configuración de Redirecciones

El archivo `netlify.toml` ya incluye:
- Redirecciones para SPA
- Headers de seguridad
- Cache para assets estáticos

## Pasos para Desplegar

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. Configura el build command: `npm run build`
4. Configura el publish directory: `.next`
5. Despliega

## Notas Importantes

- Asegúrate de que tu backend esté desplegado y accesible
- Actualiza `NEXT_PUBLIC_API_URL` con la URL real de tu backend
- El sitio funcionará como SPA con todas las rutas manejadas por Next.js
