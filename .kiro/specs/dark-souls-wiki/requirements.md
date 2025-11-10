# Requirements Document

## Introduction

Esta especificación define una aplicación web mini-wiki con temática de Dark Souls que permite a los usuarios explorar información sobre jefes del juego y participar mediante comentarios. La aplicación implementa una arquitectura de tres capas completamente dockerizada (frontend React, backend Node.js/Express, base de datos PostgreSQL) con autenticación JWT, integración con la API de YouTube, y gestión completa mediante docker-compose.

## Glossary

- **DarkSoulsWiki**: El sistema completo de la aplicación web mini-wiki
- **Frontend**: La aplicación React con Vite que proporciona la interfaz de usuario
- **Backend**: El servidor Node.js/Express que expone la API REST
- **Database**: La base de datos PostgreSQL que almacena jefes, usuarios y comentarios
- **JWT**: JSON Web Token utilizado para autenticación y autorización
- **Boss**: Entidad que representa un jefe de Dark Souls con nombre, descripción, lore e imagen
- **Comment**: Entidad que representa un comentario de usuario sobre un jefe específico
- **User**: Entidad que representa un usuario registrado en el sistema
- **YouTube API**: Servicio externo de Google para buscar videos relacionados con jefes
- **Docker Container**: Contenedor aislado que ejecuta un servicio específico (frontend, backend o database)

## Requirements

### Requirement 1: Gestión de Información de Jefes

**User Story:** Como visitante de la wiki, quiero ver una lista de jefes de Dark Souls y acceder a sus detalles completos, para poder aprender sobre ellos y su lore.

#### Acceptance Criteria

1. WHEN un usuario accede al endpoint GET /api/bosses, THE Backend SHALL devolver una lista JSON con todos los jefes incluyendo nombre, descripción corta e imagen_url
2. WHEN un usuario accede al endpoint GET /api/bosses/:id con un ID válido, THE Backend SHALL devolver los detalles completos del jefe incluyendo nombre, descripción, lore completo e imagen_url
3. WHEN un usuario accede al endpoint GET /api/bosses/:id con un ID inválido, THE Backend SHALL devolver un código de estado HTTP 404 con un mensaje de error apropiado
4. THE Frontend SHALL mostrar la lista de jefes en una interfaz visual con imágenes y descripciones cortas
5. WHEN un usuario hace clic en un jefe de la lista, THE Frontend SHALL navegar a una página de detalles mostrando toda la información del jefe

### Requirement 2: Sistema de Comentarios

**User Story:** Como usuario autenticado, quiero poder dejar comentarios en las páginas de los jefes, para compartir mis experiencias y estrategias con otros jugadores.

#### Acceptance Criteria

1. WHEN un usuario accede al endpoint GET /api/comments/:boss_id, THE Backend SHALL devolver una lista JSON con todos los comentarios asociados al jefe especificado incluyendo contenido, autor y fecha
2. WHEN un usuario autenticado envía una petición POST /api/comments con un token JWT válido y datos de comentario válidos, THE Backend SHALL crear el comentario en la Database y devolver el comentario creado con código de estado HTTP 201
3. WHEN un usuario no autenticado intenta enviar una petición POST /api/comments sin token JWT, THE Backend SHALL rechazar la petición con código de estado HTTP 401
4. WHEN un usuario envía una petición POST /api/comments con un token JWT inválido o expirado, THE Backend SHALL rechazar la petición con código de estado HTTP 403
5. THE Frontend SHALL mostrar todos los comentarios existentes en la página de detalles de cada jefe

### Requirement 3: Autenticación y Registro de Usuarios

**User Story:** Como visitante, quiero poder registrarme y autenticarme en la aplicación, para poder dejar comentarios y participar en la comunidad.

#### Acceptance Criteria

1. WHEN un usuario envía una petición POST /api/auth/register con email y contraseña válidos, THE Backend SHALL crear un nuevo User en la Database con la contraseña hasheada usando bcrypt y devolver código de estado HTTP 201
2. WHEN un usuario envía una petición POST /api/auth/register con un email ya registrado, THE Backend SHALL rechazar la petición con código de estado HTTP 409
3. WHEN un usuario envía una petición POST /api/auth/login con credenciales válidas, THE Backend SHALL verificar la contraseña usando bcrypt y devolver un JWT válido con código de estado HTTP 200
4. WHEN un usuario envía una petición POST /api/auth/login con credenciales inválidas, THE Backend SHALL rechazar la petición con código de estado HTTP 401
5. THE Frontend SHALL proporcionar formularios de registro e inicio de sesión con validación de campos

### Requirement 4: Seguridad y Autorización

**User Story:** Como administrador del sistema, quiero que la aplicación implemente medidas de seguridad robustas, para proteger los datos de los usuarios y prevenir accesos no autorizados.

#### Acceptance Criteria

1. THE Backend SHALL hashear todas las contraseñas de usuarios usando bcrypt antes de almacenarlas en la Database
2. WHEN un usuario se autentica exitosamente, THE Backend SHALL generar un JWT que incluya el ID del usuario y expire después de 24 horas
3. THE Backend SHALL implementar un middleware de verificación que valide el JWT en el header Authorization antes de permitir acceso a rutas protegidas
4. THE Backend SHALL configurar CORS para aceptar peticiones únicamente desde el dominio del Frontend
5. THE Backend SHALL almacenar la clave de la API de YouTube en variables de entorno y nunca exponerla al Frontend

### Requirement 5: Integración con API de YouTube

**User Story:** Como usuario viendo detalles de un jefe, quiero ver videos relevantes de YouTube sobre ese jefe, para aprender estrategias y ver contenido relacionado.

#### Acceptance Criteria

1. WHEN un usuario accede a la página de detalles de un jefe, THE Backend SHALL realizar una búsqueda en la YouTube API usando el nombre del jefe como término de búsqueda
2. THE Backend SHALL devolver exactamente 3 videos relevantes con título, thumbnail y URL del video
3. WHEN la YouTube API no está disponible o devuelve un error, THE Backend SHALL manejar el error gracefully y devolver una lista vacía sin interrumpir la funcionalidad principal
4. THE Frontend SHALL mostrar los videos de YouTube en la página de detalles del jefe con thumbnails clicables
5. THE Backend SHALL almacenar la API key de YouTube en una variable de entorno y nunca exponerla en respuestas al Frontend

### Requirement 6: Arquitectura Dockerizada

**User Story:** Como desarrollador, quiero que toda la aplicación esté completamente dockerizada y orquestada con docker-compose, para facilitar el despliegue y la gestión del entorno.

#### Acceptance Criteria

1. THE DarkSoulsWiki SHALL proporcionar un archivo docker-compose.yml que defina tres servicios: frontend, backend y database
2. THE Frontend SHALL tener un Dockerfile que construya una imagen de producción optimizada de la aplicación React con Vite
3. THE Backend SHALL tener un Dockerfile que construya una imagen de Node.js/Express con todas las dependencias necesarias
4. WHEN un desarrollador ejecuta "docker-compose up", THE DarkSoulsWiki SHALL iniciar todos los servicios y establecer la conectividad entre ellos
5. THE Database SHALL inicializarse automáticamente con un script SQL que cree las tablas necesarias y cargue datos de ejemplo de 3-4 jefes de Dark Souls
6. THE docker-compose.yml SHALL definir variables de entorno necesarias para la configuración de cada servicio
7. THE Backend SHALL esperar a que la Database esté lista antes de intentar conectarse

### Requirement 7: Gestión de Datos Iniciales

**User Story:** Como desarrollador, quiero que la aplicación incluya datos de ejemplo precargados, para poder probar la funcionalidad inmediatamente después del despliegue.

#### Acceptance Criteria

1. THE Database SHALL incluir un script de inicialización que cree las tablas para Boss, User y Comment
2. THE Database SHALL precargarse con información de 3-4 jefes icónicos de Dark Souls incluyendo nombre, descripción, lore completo e imagen_url
3. WHEN la Database se inicializa por primera vez, THE script SHALL ejecutarse automáticamente y poblar las tablas con datos de ejemplo
4. THE script de inicialización SHALL ser idempotente para evitar duplicación de datos en reinicios
