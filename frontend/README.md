# Okizeme - Frontend

[![Angular](https://img.shields.io/badge/Angular-21.1.0-DD0031?logo=angular)](https://angular.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

> Esta aplicación funciona en coordinación con un backend hosteado en `http://localhost:3000`. De manera que si no se cuenta con el backend corriendo, **no funcionará correctamente**. Se sugiere revisar el [README.md del backend](../backend/README.md) y revisar los apartados de [Requisitos Previos](#-requisitos-previos) e [Instalación](#-instalación), a la vez que setear las [Variables de Entorno](#-variables-de-entorno).

## Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Variables de Entorno](#-variables-de-entorno)

## Descripción

Esta carpeta contiene el frontend de una aplicación web que permite a los usuarios crear y organizar torneos de videojuegos competitivos. La aplicación facilita la inscripción de participantes, la visualización de torneos disponibles, la gestión de perfiles y la generación automática de llaves (brackets) de torneo.

### Funcionalidades Principales

- **Explorar torneos**: Listado con filtros por juego, ubicación y tags
- **Inscripción**: Participantes pueden inscribirse a torneos abiertos
- **Gestión de perfil**: Usuarios pueden gestionar su información personal
- **Panel de administración**: CRUD completo para juegos, localidades, tags, roles, torneos y regiones
- **Autenticación**: Sistema de login/registro con JWT y Cookies httpOnly

## Tecnologías

| Categoría                | Tecnología                    |
| ------------------------ | ----------------------------- |
| Framework                | Angular 21.1.0                |
| Lenguaje                 | TypeScript 5.9.2              |
| Estilos                  | TailwindCSS 4.x + DaisyUI 5.x |
| Iconos                   | Iconify                       |
| Testing                  | -                             |
| Notificaciones (Toaster) | ngx-sonner                    |
| Auth                     | JWT con cookies httpOnly      |

## Requisitos Previos

- **Node.js**
- **npm**
- Backend corriendo en `http://localhost:3000` (que tenga hosteado el [backend](https://github.com/MarthQ/gestion-torneos-dsw/tree/main/backend))

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/MarthQ/gestion-torneos-dsw.git
   cd gestion-torneos-dsw/frontend
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copiar `src/environments/environment.development.ts` y ajustar si es necesario
   - Asegurarse de que el backend esté corriendo

4. **Iniciar el servidor de desarrollo**

   ```bash
   npm start
   ```

   O, alternativamente si se tiene instalado el cliente de angular (Angular CLI), puede usarse:

   ```bash
   ng serve
   ```

5. **Abrir en el navegador**
   - La aplicación va a estar disponible en `http://localhost:4200/`

## Estructura del Proyecto

```
src/app/
├── features/                    # Módulos por funcionalidad
│   ├── admin/                   # Panel de administración
│   │   ├── pages/               # Páginas CRUD (game, location, region, role, tag, tournament, user)
│   │   ├── services/            # Servicios específicos de admin
│   │   └── interfaces/          # Tipos e interfaces de admin
│   ├── auth/                    # Autenticación
│   │   ├── pages/               # Login, registro, recuperación
│   │   ├── guards/              # Guardias de autenticación
│   │   ├── interceptors/        # Interceptor para token JWT
│   │   ├── services/            # AuthService
│   │   └── layout/              # Layouts de auth
│   └── tournament-hub/          # Funcionalidad principal
│       ├── pages/               # Explore, MyInscriptions, UserProfile, SetupPassword
│       ├── components/          # Componentes reutilizables del hub
│       └── layout/              # MainLayout
├── shared/                      # Código compartido entre features
│   ├── components/              # Componentes UI compartidos (search-bar, pagination, etc.)
│   ├── services/                # Servicios HTTP compartidos
│   ├── interfaces/              # Tipos e interfaces compartidos
│   └── utils/                   # Funciones utilitarias
├── app.config.ts                # Configuración de la aplicación
├── app.routes.ts                # Rutas principales
└── app.ts                       # Componente raíz
```

## Variables de Entorno

| Variable             | Descripción     | Default                     |
| -------------------- | --------------- | --------------------------- |
| `environment.apiUrl` | URL del backend | `http://localhost:3000/api` |

Archivos de entorno:

- `src/environments/environment.ts` - Producción
- `src/environments/environment.development.ts` - Desarrollo

## Links Útiles

- [Repositorio](https://github.com/MarthQ/gestion-torneos-dsw)
- [Documentación Angular](https://angular.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
