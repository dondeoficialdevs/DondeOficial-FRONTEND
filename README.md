# Frontend - DirectorioComercial

Aplicación frontend construida con Next.js 15, React 19, TypeScript y Tailwind CSS. Para documentación completa del proyecto, consultar [README.md](../README.md) y [DOCUMENTACION_TECNICA.md](../DOCUMENTACION_TECNICA.md).

## Tecnologías Utilizadas

- Next.js 15 con App Router
- React 19 con hooks modernos
- TypeScript para tipado estático
- Tailwind CSS para estilos
- Axios para peticiones HTTP
- SWR para manejo de estado de servidor

## Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   ├── globals.css        # Estilos globales
│   └── businesses/        # Páginas de negocios
├── components/            # Componentes reutilizables
│   ├── Header.tsx         # Navegación principal
│   ├── HeroSection.tsx    # Sección principal con búsqueda
│   ├── FeaturedListings.tsx # Listado de negocios destacados
│   ├── CategorySection.tsx # Grid de categorías
│   ├── BusinessList.tsx   # Lista de negocios
│   └── Footer.tsx         # Pie de página
├── lib/                   # Utilidades y configuración
│   └── api.ts            # Cliente API con endpoints
└── types/                 # Definiciones de TypeScript
    └── index.ts          # Interfaces y tipos
```

## Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- API backend ejecutándose en puerto 5000

### Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
# Crear archivo .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

## Scripts Disponibles

- `npm run dev` - Ejecuta en modo desarrollo con hot reload
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter de código

## Componentes Principales

### Header
Componente de navegación principal que incluye:
- Logo de la aplicación
- Menú de navegación
- Botones de acción (Search, Wishlist, Cart)
- Botón "Add Listing"

### HeroSection
Sección principal con:
- Título y subtítulo
- Formulario de búsqueda (término y ubicación)
- Botones de búsquedas populares

### FeaturedListings
Listado de negocios que muestra:
- Grid responsive de tarjetas
- Información básica del negocio
- Estado (Open/Close)
- Categoría
- Botones de acción

### CategorySection
Grid de categorías con:
- Iconos de categoría
- Nombre de categoría
- Enlaces de navegación

## API Integration

La aplicación consume la API REST del backend mediante:
- Cliente HTTP configurado en `lib/api.ts`
- Endpoints para negocios y categorías
- Manejo de errores y estados de carga

### Endpoints Utilizados

- GET /api/businesses - Lista negocios con filtros
- GET /api/categories - Lista categorías disponibles

## Responsive Design

La aplicación está optimizada para:
- Dispositivos móviles (320px+)
- Tablets (768px+)
- Desktop (1024px+)

Utiliza Tailwind CSS con clases responsive para adaptarse automáticamente.

## Tipado TypeScript

Definiciones de tipos principales:
- `Business` - Estructura de negocio
- `Category` - Estructura de categoría
- `ApiResponse` - Respuestas de la API
- `BusinessFilters` - Filtros de búsqueda

## Variables de Entorno

- `NEXT_PUBLIC_API_URL` - URL base de la API (pública para el cliente)

## Deploy en Netlify

1. Conectar repositorio a Netlify
2. Configurar build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Configurar variable de entorno:
   - `NEXT_PUBLIC_API_URL`: URL de la API en producción

## Estructura de Estilos

- Tailwind CSS para utilidades
- Clases personalizadas en `globals.css`
- Componentes estilizados con Tailwind
- Diseño coherente con el sitio original

## Desarrollo

Para contribuir al proyecto:
1. Crear rama desde main
2. Realizar cambios siguiendo las convenciones
3. Probar en modo desarrollo
4. Crear pull request

## Notas Técnicas

- Utiliza Next.js App Router para enrutamiento
- Componentes funcionales con hooks de React
- Manejo de estado local con useState
- Configuración de TypeScript estricta
- Linting con ESLint configurado