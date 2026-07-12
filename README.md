# AulaNova

AulaNova es una aplicación web para gestionar una escuela de idiomas. El frontend consume una API REST propia y muestra distintas funciones según el rol del usuario.

**Autor:** Nikolay Kovalev

## Tecnologías

- React
- Vite
- JavaScript
- HTML
- CSS

## Requisitos

- Node.js instalado.
- Backend de AulaNova ejecutándose.

## Instalación

```bash
npm install
```

## Configuración

Copiar el archivo `.env.example` como `.env`. La configuración esperada es:

```env
VITE_API_URL=http://localhost:8888/api
```

## Ejecución

```bash
npm run dev
```

La URL local habitual del frontend es:

```text
http://localhost:5173
```

La URL esperada de la API es:

```text
http://localhost:8888/api
```

## Usuarios de prueba

| Rol | Email | Contraseña |
| --- | --- | --- |
| Administrador | admin@aulanova.com | admin123 |
| Profesor | profesor@aulanova.com | profe123 |
| Alumno | alumno@aulanova.com | alumno123 |

## Funcionalidades por rol

- **Administrador:** gestión de usuarios, cursos y asignación de alumnos.
- **Profesor:** consulta de sus cursos y gestión de clases.
- **Alumno:** consulta de sus cursos y clases.

La autenticación utiliza tokens JWT entregados por la API.

## Backend

El código del backend está disponible en:

https://github.com/kovalev-nikolay/plataformas-final-aulanova-api
