# Documentación de Imágenes - SpecialOffers

## Índice
1. [Imágenes de Fondo para Tarjetas](#imágenes-de-fondo-para-tarjetas)
2. [Especificaciones Técnicas](#especificaciones-técnicas)
3. [Guía de Preparación](#guía-de-preparación)
4. [Ubicación de Archivos](#ubicación-de-archivos)
5. [Recomendaciones de Diseño](#recomendaciones-de-diseño)
6. [Herramientas y Procesos](#herramientas-y-procesos)
7. [Checklist de Preparación](#checklist-de-preparación)
8. [Proceso de Actualización](#proceso-de-actualización)
9. [Consideraciones Responsive](#consideraciones-responsive)
10. [Solución de Problemas](#solución-de-problemas)

---

## 🎨 Imágenes de Fondo para Tarjetas

### Tarjeta WhatsApp
- **Archivo:** `whatsapp-bg.jpg` o `whatsapp-bg.png`
- **Ubicación:** `frontend/src/multimedia/imagenes/globales/whatsapp-bg.jpg`
- **Uso:** Imagen de fondo para la tarjeta de contacto por WhatsApp

### Tarjeta Directorio
- **Archivo:** `directorio-bg.jpg` o `directorio-bg.png`
- **Ubicación:** `frontend/src/multimedia/imagenes/globales/directorio-bg.jpg`
- **Uso:** Imagen de fondo para la tarjeta de exploración del directorio

---

## Especificaciones Técnicas

### Dimensiones Recomendadas

#### Resolución Base
- **Ancho:** 1920px
- **Alto:** 400px
- **Aspect Ratio:** 4.8:1 (landscape horizontal)

#### Resoluciones Alternativas (Responsive)
- **Desktop (1920px+):** 1920x400px
- **Tablet (768px - 1919px):** 1200x300px
- **Mobile (320px - 767px):** 800x250px

### Formato de Archivo
- **Formato Principal:** JPG (recomendado para fotografías)
- **Formato Alternativo:** PNG (si requiere transparencia)
- **Compresión:** Optimizada para web (calidad 80-85%)

### Tamaño de Archivo
- **Máximo Recomendado:** 200KB por imagen
- **Óptimo:** 100-150KB
- **Mínimo:** 50KB (sin perder calidad visual)

### Calidad de Imagen
- **Resolución:** 72 DPI (suficiente para web)
- **Color Space:** sRGB
- **Profundidad de Color:** 8 bits por canal (24 bits total)

---

## Guía de Preparación

### Composición de la Imagen

#### Para Tarjeta WhatsApp
- **Tema:** Comunicación, negocios, personas interactuando
- **Elementos Sugeridos:**
  - Personas en reunión de negocios
  - Dispositivos móviles o tablets
  - Ambiente profesional y moderno
  - Colores: Verde, blanco, tonos claros

#### Para Tarjeta Directorio
- **Tema:** Exploración, búsqueda, ciudad, negocios
- **Elementos Sugeridos:**
  - Edificios o skyline urbano
  - Mapas o iconografía de ubicación
  - Ambiente dinámico y urbano
  - Colores: Azul, índigo, tonos vibrantes

### Zona de Seguridad (Safe Area)

```
┌─────────────────────────────────────┐
│  Zona de Seguridad (Texto)          │
│  ┌───────────────────────────────┐  │
│  │  Contenido Principal          │  │
│  │  (Iconos, Títulos, Texto)     │  │
│  │                                │  │
│  │  Área visible sin obstáculos   │  │
│  └───────────────────────────────┘  │
│                                     │
│  Zona de Fondo (Puede tener        │
│  elementos decorativos)            │
└─────────────────────────────────────┘
```

- **Margen Izquierdo:** 20% del ancho (área donde va el contenido)
- **Margen Derecho:** 10% del ancho (puede tener elementos decorativos)
- **Margen Superior:** 15% del alto
- **Margen Inferior:** 15% del alto

### Consideraciones de Diseño

#### Contraste
- **Importante:** La imagen debe tener suficiente contraste para que el texto blanco sea legible
- **Solución:** Se aplica un overlay oscuro (50% opacidad) automáticamente
- **Recomendación:** Usar imágenes con áreas oscuras o aplicar un gradiente oscuro en post-producción

#### Enfoque
- **Zona de Enfoque:** Centro-izquierda (donde va el contenido)
- **Desenfoque Opcional:** El fondo puede estar ligeramente desenfocado para destacar el contenido

#### Iluminación
- **Dirección:** Preferiblemente desde la izquierda o centro
- **Intensidad:** Moderada (evitar imágenes muy brillantes o muy oscuras)
- **Balance:** Uniforme, sin áreas extremadamente claras u oscuras

---

## Ubicación de Archivos

### Estructura de Carpetas
```
frontend/
└── src/
    └── multimedia/
        └── imagenes/
            └── globales/
                ├── whatsapp-bg.jpg
                ├── whatsapp-bg.png (alternativo)
                ├── directorio-bg.jpg
                └── directorio-bg.png (alternativo)
```

### Configuración en CSS
Las imágenes se configuran en: `frontend/src/app/globals.css`

**Líneas 172-184:**
```css
.card-whatsapp-bg {
  background-image: url('/multimedia/imagenes/globales/whatsapp-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-directory-bg {
  background-image: url('/multimedia/imagenes/globales/directorio-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

---

## Recomendaciones de Diseño

### Paleta de Colores

#### Tarjeta WhatsApp
- **Colores Principales:** Verde (#10b981, #059669, #047857)
- **Colores Complementarios:** Blanco, gris claro
- **Overlay:** Negro con 50% opacidad + gradiente verde

#### Tarjeta Directorio
- **Colores Principales:** Azul (#2563eb), Índigo (#1d4ed8), Púrpura (#4338ca)
- **Colores Complementarios:** Blanco, gris claro
- **Overlay:** Negro con 50% opacidad + gradiente azul-índigo

### Estilo Visual
- **Estilo:** Moderno, profesional, limpio
- **Mood:** Dinámico, confiable, accesible
- **Textura:** Puede tener textura sutil, pero no debe distraer del contenido

### Elementos a Evitar
- Texto en la imagen (el texto se agrega en HTML)
- Logos grandes o marcas de agua prominentes
- Elementos muy contrastantes en el área de contenido (izquierda)
- Imágenes con mucho detalle que compitan con el texto
- Imágenes con derechos de autor sin licencia

---

## Herramientas y Procesos

### Edición de Imágenes
- **Adobe Photoshop:** Para ajustes profesionales
- **GIMP:** Alternativa gratuita
- **Figma:** Para diseño y composición
- **Canva:** Para edición rápida

### Optimización
- **TinyPNG / TinyJPG:** Compresión sin pérdida de calidad
- **Squoosh:** Optimización avanzada de Google
- **ImageOptim:** Para Mac
- **RIOT:** Para Windows

### Validación
- **PageSpeed Insights:** Verificar tiempo de carga
- **WebPageTest:** Análisis de rendimiento
- **Lighthouse:** Auditoría de performance

---

## Checklist de Preparación

Antes de subir las imágenes, verifica:

- [ ] Dimensiones: 1920x400px (o proporción 4.8:1)
- [ ] Formato: JPG (o PNG si es necesario)
- [ ] Tamaño de archivo: < 200KB
- [ ] Resolución: 72 DPI
- [ ] Color Space: sRGB
- [ ] Contraste: Suficiente para texto blanco
- [ ] Zona de seguridad: Área izquierda libre de obstáculos
- [ ] Optimización: Comprimida para web
- [ ] Nombre de archivo: `whatsapp-bg.jpg` y `directorio-bg.jpg`
- [ ] Ubicación: `frontend/src/multimedia/imagenes/globales/`

---

## Proceso de Actualización

### Paso 1: Preparar las Imágenes
1. Editar imágenes según especificaciones
2. Optimizar tamaño y calidad
3. Guardar con nombres correctos

### Paso 2: Colocar en el Proyecto
1. Copiar imágenes a `frontend/src/multimedia/imagenes/globales/`
2. Verificar que los nombres coincidan con el CSS

### Paso 3: Actualizar CSS (si es necesario)
Si cambias los nombres de archivo, actualiza `globals.css`:
```css
.card-whatsapp-bg {
  background-image: url('/multimedia/imagenes/globales/NUEVO_NOMBRE.jpg');
}
```

### Paso 4: Verificar
1. Reiniciar el servidor de desarrollo
2. Verificar que las imágenes se carguen correctamente
3. Probar en diferentes tamaños de pantalla
4. Verificar que el texto sea legible sobre las imágenes

---

## Consideraciones Responsive

Las imágenes se adaptan automáticamente gracias a `background-size: cover`, pero ten en cuenta:

- **Mobile:** La imagen se recortará verticalmente, asegúrate de que el área importante esté centrada
- **Tablet:** Similar a mobile, pero con más espacio horizontal
- **Desktop:** La imagen completa será visible

**Recomendación:** Diseña pensando en mobile-first, colocando los elementos importantes en el centro de la imagen.

---

## Solución de Problemas

### La imagen no se muestra
- Verifica la ruta en `globals.css`
- Asegúrate de que el archivo existe en la ubicación correcta
- Reinicia el servidor de desarrollo

### La imagen se ve pixelada
- Verifica que la resolución sea al menos 1920x400px
- Asegúrate de que no se esté escalando más del 100%

### El texto no es legible
- Ajusta el overlay oscuro en el CSS (actualmente 50% opacidad)
- Usa una imagen con mejor contraste
- Considera aplicar un gradiente más oscuro

### La imagen tarda en cargar
- Optimiza el tamaño del archivo (< 200KB)
- Considera usar formato WebP para mejor compresión
- Implementa lazy loading si es necesario

---

## Notas Adicionales

- Las imágenes se cargan como fondo CSS, por lo que no afectan el SEO directamente
- Considera usar `loading="lazy"` si implementas imágenes adicionales
- Para mejor rendimiento, considera usar formato WebP con fallback JPG
- Las imágenes deben tener licencia de uso comercial

---

**Última actualización:** 2025
**Versión:** 1.0
