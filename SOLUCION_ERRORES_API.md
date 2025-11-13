# Solución de Errores de Conexión con el API

## Problema

Si ves errores como:
- "Network error. Please check your connection."
- "Error al cargar las categorías"
- "No se pudo conectar con el servidor"

Esto significa que el frontend no puede conectarse al backend.

## Solución

### 1. Verificar que el Backend esté Corriendo

Abre una terminal y navega a la carpeta del backend:

```bash
cd backend
```

Inicia el servidor:

```bash
npm start
```

O en modo desarrollo:

```bash
npm run dev
```

El backend debería estar corriendo en `http://localhost:5000`

### 2. Verificar la URL del API

El frontend intenta conectarse a la URL configurada en la variable de entorno `NEXT_PUBLIC_API_URL`.

**Por defecto:** `http://localhost:5000/api`

### 3. Configurar la Variable de Entorno (si es necesario)

Si tu backend está corriendo en una URL diferente, crea un archivo `.env.local` en la carpeta `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Importante:** Si estás accediendo desde otra máquina en la red (como `192.168.101.6:3000`), necesitas:

1. Asegurarte de que el backend esté escuchando en todas las interfaces (`0.0.0.0` en lugar de `localhost`)
2. Configurar la URL del API con la IP de tu máquina:

```env
NEXT_PUBLIC_API_URL=http://192.168.101.6:5000/api
```

### 4. Reiniciar el Servidor de Desarrollo

Después de cambiar las variables de entorno, reinicia el servidor de Next.js:

```bash
# Detén el servidor (Ctrl+C)
# Luego inicia de nuevo
npm run dev
```

### 5. Verificar CORS en el Backend

Asegúrate de que el backend tenga configurado CORS para permitir requests desde tu frontend. En el archivo del servidor del backend, debería haber algo como:

```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## Verificación Rápida

1. Abre tu navegador y ve a: `http://localhost:5000/api/health`
2. Deberías ver una respuesta JSON como:
   ```json
   {
     "message": "API is running",
     "status": "ok"
   }
   ```
3. Si no ves esta respuesta, el backend no está corriendo correctamente.

## Solución para Acceso desde Red Local

Si estás accediendo desde otra máquina en tu red local:

1. **Backend:** Asegúrate de que esté escuchando en `0.0.0.0:5000` (no solo `localhost`)
2. **Frontend:** Configura `.env.local` con la IP de tu máquina:
   ```env
   NEXT_PUBLIC_API_URL=http://TU_IP_LOCAL:5000/api
   ```
   Ejemplo: `http://192.168.101.6:5000/api`

3. **Firewall:** Asegúrate de que el puerto 5000 esté abierto en tu firewall

## Contacto

Si el problema persiste, verifica:
- Los logs del backend para ver si hay errores
- La consola del navegador (F12) para ver errores detallados
- Que ambos servidores (frontend y backend) estén corriendo

