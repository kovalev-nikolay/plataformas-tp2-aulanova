# AulaNova - Sistema para escuela de idiomas

## Materia

Plataformas de Desarrollo

## Integrante

Nikolay Kovalev

## Temática

AulaNova es una Single Page Application para una escuela de idiomas chica en Buenos Aires.

La idea del proyecto es tener una aplicación simple para mostrar información de la escuela, permitir el ingreso de usuarios y mostrar paneles distintos según el rol.

## Tecnologías

- React
- Vite
- JavaScript
- HTML
- CSS
- Mock data local

## Usuarios de prueba

| Rol | Email | Contraseña |
| --- | --- | --- |
| Admin | admin@aulanova.com | admin123 |
| Profesor | profesor@aulanova.com | profe123 |
| Alumno | alumno@aulanova.com | alumno123 |

## Funcionalidades principales

- Landing page con secciones Inicio, Cursos, Beneficios y Contacto.
- Login y logout.
- Roles admin, profesor y alumno.
- Dashboard distinto según rol.
- Admin puede gestionar usuarios de forma local.
- Admin puede gestionar cursos de forma local.
- Profesor puede consultar sus clases y alumnos.
- Alumno puede consultar cursos y próximas clases ordenadas por fecha.
- Formulario de contacto visual en la landing page.

## Aclaraciones

- El proyecto no usa backend ni base de datos porque corresponde al TP_2 frontend.
- Los datos son mock/locales.
- Para el final se podría agregar API REST, base de datos y autenticación con token.

## Comandos

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```
