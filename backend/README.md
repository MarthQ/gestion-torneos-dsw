# Okizeme - Backend

[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql)](https://www.mysql.com/)

> Backend de la aplicación web para crear y organizar torneos de videojuegos competitivos. Trabaja en conjunto con el [frontend de Okizeme](../frontend/README.md). De todas maneras puede interactuarse con la base de datos con aplicaciones como Postman.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Variables de Entorno](#variables-de-entorno)

## Descripción

API REST construida con Express y TypeScript que gestiona toda la lógica de negocio de la aplicación: usuarios, torneos, inscripciones, brackets y autenticación. Usa MikroORM como ORM para MySQL y Zod para validación de contenido de requests.

### Funcionalidades Principales

- **Autenticación**: Login/registro con JWT almacenado en cookies httpOnly
- **CRUD completo**: Usuarios, torneos, juegos, localidades, regiones, tags, roles
- **Inscripciones**: Los usuarios pueden inscribirse a torneos
- **Gestión de torneos**: Creación, edición, eliminación con validación de permisos (owner o admin)
- **Recuperación de contraseña**: Envío de mail con token para resetear password
- **Seed automático**: Roles, localidades, tags y regiones se cargan al iniciar

## Tecnologías

| Categoría  | Tecnología           |
| ---------- | -------------------- |
| Framework  | Express 4.x          |
| Lenguaje   | TypeScript 5.4.5     |
| ORM        | MikroORM 6.2 (MySQL) |
| Validación | Zod                  |
| Auth       | JWT                  |
| Mails      | Nodemailer           |

## Requisitos Previos

- **Node.js**
- **pnpm** (o, en su defecto **npm**)
- **Docker** (para la base de datos) o MySQL Workbench

## Instalación

1. **Clonar el repositorio**

    ```bash
    git clone https://github.com/MarthQ/gestion-torneos-dsw.git
    cd gestion-torneos-dsw/backend
    ```

2. **Instalar dependencias**

    ```bash
    pnpm install
    ```

3. **Levantar la base de datos**

    ```bash
    docker compose up -d
    ```

    Esto levanta un contenedor de Percona Server (MySQL) en `localhost:3306` con la base `okiDSW`.

4. **Configurar variables de entorno**

    Crear un archivo `.env` en la raíz del backend basado en el `.env.template`. Las variables obligatorias son:

    | Variable              | Descripción                              | Ejemplo                 |
    | --------------------- | ---------------------------------------- | ----------------------- |
    | `DB_NAME`             | Nombre de la base de datos               | `...`                   |
    | `DB_PASSWORD`         | Contraseña de la base de datos           | `...`                   |
    | `DB_HOST`             | Host de la base de datos                 | Por default `localhost` |
    | `DB_PORT`             | Puerto de la base de datos               | Por default `3306`      |
    | `DB_USERNAME`         | Usuario de la base de datos              | `...`                   |
    | `JWT_SECRET`          | Clave para firmar tokens JWT             | `tu-secreto`            |
    | `DEFAULT_SALT_ROUNDS` | Rounds para bcrypt                       | `10`                    |
    | `FRONTEND_URL`        | URL del frontend (CORS)                  | `http://localhost:4200` |
    | `SMTP_HOST`           | Host del servidor SMTP                   | `smtp.gmail.com`        |
    | `SMTP_PORT`           | Puerto SMTP                              | `587`                   |
    | `SMTP_USER`           | Usuario SMTP                             | `tu@email.com`          |
    | `SMTP_PASS`           | Contraseña SMTP                          | `tu-password`           |
    | `MAIL_FROM`           | Remitente de mails                       | `noreply@email.com`     |
    | `IGDB_CLIENT_ID`      | Client ID de IGDB (para datos de juegos) | `...`                   |
    | `IGDB_ACCESS_TOKEN`   | Access Token de IGDB                     | `...`                   |

5. **Iniciar el servidor**

    ```bash
    pnpm start:dev
    ```

    La API va a estar disponible en `http://localhost:3000/api`. El servidor reinicia automáticamente al modificar archivos.

## Estructura del Proyecto

```
src/
├── auth/                          # Autenticación
│   ├── auth.controller.ts         # Login, registro, logout, forgot/setup password
│   ├── auth.routes.ts             # Rutas de auth
│   ├── interfaces/                # Tipos (USER_ROLE, etc.)
│   └── middlewares/               # authentication, isOwnerOrAdmin, authorize
├── config/
│   └── env.ts                     # Variables de entorno validadas
├── db/
│   └── seeds.ts                   # Seeds automáticos al iniciar
├── game/                          # CRUD de juegos
├── inscription/                   # Inscripciones a torneos
├── location/                      # CRUD de localidades
├── matchup/                       # Gestión de partidas/brackets
├── region/                        # CRUD de regiones
├── role/                          # CRUD de roles
├── shared/                        # Código compartido
│   ├── auth/                      # JWT utils
│   ├── db/                        # ORM config, BaseEntity
│   ├── interfaces/                # Interfaces compartidas
│   ├── mailer/                    # Servicio de envío de mails
│   └── mappers/                   # Mappers de entidades a response DTOs
├── tag/                           # CRUD de tags
├── tournament/                    # CRUD de torneos
├── user/                          # CRUD de usuarios
└── app.ts                         # Entry point
```

## Variables de Entorno

Todas las variables se validan al inicio en `src/config/env.ts`. Si falta alguna obligatoria, el servidor no arranca.

Para crear tu propio `.env`, se propone el archivo `.env.template`. Es importante respetar los formatos string, number o boolean para evitar error.
