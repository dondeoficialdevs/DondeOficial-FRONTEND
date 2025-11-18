# Actualización del Service Worker

## ¿Cuándo actualizar la versión?

Incrementa la versión del service worker (`SW_VERSION` en `public/sw.js`) cuando:
- Agregas nuevas funcionalidades importantes
- Haces cambios en la estructura de la aplicación
- Actualizas dependencias críticas
- Necesitas forzar una actualización para todos los usuarios

## Cómo actualizar

1. Abre `frontend/public/sw.js`
2. Incrementa el número de versión:
   ```javascript
   const SW_VERSION = '2.0.1'; // Cambiar de 2.0.0 a 2.0.1
   ```
3. Haz commit y push de los cambios
4. Los usuarios verán automáticamente una notificación de actualización

## Estrategia de caché implementada

- **HTML/JS**: Network First - Siempre busca la versión más reciente
- **CSS**: Network First con fallback a caché
- **Imágenes/Assets estáticos**: Cache First con actualización en background
- **Service Worker**: No se cachea, siempre se verifica la versión más reciente

## Notas importantes

- Los usuarios verán automáticamente las actualizaciones sin necesidad de limpiar caché
- El service worker verifica actualizaciones cada 5 minutos
- Cuando hay una nueva versión, se muestra una notificación al usuario
- La página se recarga automáticamente cuando se detecta una actualización

