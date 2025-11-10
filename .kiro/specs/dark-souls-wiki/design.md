# Design Document - Dark Souls Wiki

## Overview

La Dark Souls Wiki es una aplicación web de tres capas que implementa una arquitectura de microservicios dockerizada. El sistema permite a los usuarios explorar información sobre jefes de Dark Souls, ver videos relacionados de YouTube, y participar mediante comentarios autenticados. La arquitectura separa claramente las responsabilidades entre presentación (React), lógica de negocio (Express API), y persistencia (PostgreSQL).

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Host                          │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │   Frontend   │      │   Backend    │      │ Database │ │
│  │   (React)    │◄────►│  (Express)   │◄────►│(Postgres)│ │
│  │   Port 5173  │      │   Port 3000  │      │ Port 5432│ │
│  └──────────────┘      └──────────────┘      └──────────┘ │
│         │                      │                           │
│         │                      │                           │
│         │                      ▼                           │
│         │              ┌──────────────┐                    │
│         │              │  YouTube API │                    │
│         │              │  (External)  │                    │
│         │              └──────────────┘                    │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
    User Browser
```

### Container Architecture

**Frontend Container:**
- Base: Node.js Alpine para build, Nginx Alpine para servir
- Expone puerto 5173
- Variables de entorno: VITE_API_URL

**Backend Container:**
- Base: Node.js 18 Alpine
- Expone puerto 3000
- Variables de entorno: DATABASE_URL, JWT_SECRET, YOUTUBE_API_KEY, CORS_ORIGIN

**Database Container:**
- Base: PostgreSQL 15 Alpine
- Expone puerto 5432
- Volumen persistente para datos
- Script de inicialización automática

### Network Architecture

Todos los contenedores se comunican a través de una red Docker personalizada (`darksouls-network`). El frontend se comunica con el backend mediante HTTP, y el backend se conecta a la base de datos mediante el driver pg de PostgreSQL.

## Components and Interfaces

### Frontend Components

#### 1. App Component (App.jsx)
- **Responsabilidad:** Componente raíz, maneja routing y contexto de autenticación
- **Dependencias:** React Router, AuthContext
- **Rutas:**
  - `/` - Home/Lista de jefes
  - `/boss/:id` - Detalles de jefe
  - `/login` - Página de login
  - `/register` - Página de registro

#### 2. AuthContext (contexts/AuthContext.jsx)
- **Responsabilidad:** Gestiona estado global de autenticación
- **Estado:**
  - `user`: Objeto con datos del usuario autenticado
  - `token`: JWT almacenado en localStorage
- **Métodos:**
  - `login(email, password)`: Autentica usuario y almacena token
  - `register(email, password)`: Registra nuevo usuario
  - `logout()`: Limpia token y estado de usuario

#### 3. BossList Component (components/BossList.jsx)
- **Responsabilidad:** Muestra grid de jefes con imágenes y descripciones
- **API Calls:** GET /api/bosses
- **Props:** Ninguna
- **Estado:** `bosses` array

#### 4. BossDetail Component (components/BossDetail.jsx)
- **Responsabilidad:** Muestra detalles completos de un jefe, videos de YouTube y comentarios
- **API Calls:** 
  - GET /api/bosses/:id
  - GET /api/comments/:boss_id
  - GET /api/bosses/:id/videos
- **Props:** `id` (desde URL params)
- **Estado:** `boss`, `comments`, `videos`

#### 5. CommentForm Component (components/CommentForm.jsx)
- **Responsabilidad:** Formulario para crear nuevos comentarios
- **API Calls:** POST /api/comments (con JWT)
- **Props:** `bossId`, `onCommentAdded`
- **Estado:** `content`, `isSubmitting`

#### 6. CommentList Component (components/CommentList.jsx)
- **Responsabilidad:** Renderiza lista de comentarios
- **Props:** `comments` array
- **Estado:** Ninguno (stateless)

#### 7. LoginForm Component (components/LoginForm.jsx)
- **Responsabilidad:** Formulario de autenticación
- **Props:** Ninguna
- **Estado:** `email`, `password`, `error`

#### 8. RegisterForm Component (components/RegisterForm.jsx)
- **Responsabilidad:** Formulario de registro
- **Props:** Ninguna
- **Estado:** `email`, `password`, `confirmPassword`, `error`

### Backend Components

#### 1. Server (server.js)
- **Responsabilidad:** Punto de entrada, configuración de Express, middleware global
- **Middleware:**
  - `cors()` - Configurado con CORS_ORIGIN
  - `express.json()` - Parser de JSON
  - `helmet()` - Headers de seguridad
- **Rutas montadas:**
  - `/api/auth` → authRoutes
  - `/api/bosses` → bossRoutes
  - `/api/comments` → commentRoutes

#### 2. Database Connection (config/database.js)
- **Responsabilidad:** Pool de conexiones PostgreSQL
- **Exports:** `pool` object
- **Configuración:** Lee DATABASE_URL de variables de entorno
- **Health Check:** Función `testConnection()` que verifica conectividad

#### 3. Auth Routes (routes/auth.js)
- **Endpoints:**
  - `POST /api/auth/register` → authController.register
  - `POST /api/auth/login` → authController.login

#### 4. Boss Routes (routes/bosses.js)
- **Endpoints:**
  - `GET /api/bosses` → bossController.getAllBosses
  - `GET /api/bosses/:id` → bossController.getBossById
  - `GET /api/bosses/:id/videos` → bossController.getBossVideos

#### 5. Comment Routes (routes/comments.js)
- **Endpoints:**
  - `GET /api/comments/:boss_id` → commentController.getCommentsByBoss
  - `POST /api/comments` → [authMiddleware], commentController.createComment

#### 6. Auth Controller (controllers/authController.js)
- **Métodos:**
  - `register(req, res)`: Valida datos, hashea contraseña con bcrypt (10 rounds), crea usuario
  - `login(req, res)`: Valida credenciales, compara hash, genera JWT (expiración 24h)

#### 7. Boss Controller (controllers/bossController.js)
- **Métodos:**
  - `getAllBosses(req, res)`: Query a DB, devuelve lista
  - `getBossById(req, res)`: Query con WHERE id, devuelve detalles o 404
  - `getBossVideos(req, res)`: Llama a YouTube API, devuelve 3 videos

#### 8. Comment Controller (controllers/commentController.js)
- **Métodos:**
  - `getCommentsByBoss(req, res)`: Query con JOIN a users, devuelve comentarios con autor
  - `createComment(req, res)`: Inserta comentario con user_id del JWT

#### 9. Auth Middleware (middleware/auth.js)
- **Responsabilidad:** Verifica JWT en header Authorization
- **Flujo:**
  1. Extrae token del header "Bearer <token>"
  2. Verifica token con jwt.verify() y JWT_SECRET
  3. Adjunta `req.user` con payload decodificado
  4. Llama next() o devuelve 401/403

#### 10. YouTube Service (services/youtubeService.js)
- **Responsabilidad:** Integración con YouTube Data API v3
- **Método:** `searchVideos(query, maxResults = 3)`
- **Configuración:** Usa YOUTUBE_API_KEY de env
- **Endpoint:** GET https://www.googleapis.com/youtube/v3/search
- **Parámetros:** part=snippet, q=query, type=video, maxResults
- **Retorno:** Array de objetos {videoId, title, thumbnail, url}

## Data Models

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Bosses Table
```sql
CREATE TABLE bosses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  lore TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Comments Table
```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  boss_id INTEGER NOT NULL REFERENCES bosses(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Data Transfer Objects

#### Boss DTO (List)
```json
{
  "id": 1,
  "name": "Artorias the Abysswalker",
  "short_description": "A legendary knight corrupted by the Abyss",
  "image_url": "https://example.com/artorias.jpg"
}
```

#### Boss DTO (Detail)
```json
{
  "id": 1,
  "name": "Artorias the Abysswalker",
  "short_description": "A legendary knight corrupted by the Abyss",
  "lore": "Full lore text here...",
  "image_url": "https://example.com/artorias.jpg"
}
```

#### Comment DTO
```json
{
  "id": 1,
  "boss_id": 1,
  "user_id": 5,
  "user_email": "user@example.com",
  "content": "This boss is incredibly difficult!",
  "created_at": "2025-11-09T10:30:00Z"
}
```

#### Video DTO
```json
{
  "videoId": "abc123",
  "title": "Artorias Boss Guide",
  "thumbnail": "https://i.ytimg.com/vi/abc123/default.jpg",
  "url": "https://www.youtube.com/watch?v=abc123"
}
```

#### JWT Payload
```json
{
  "userId": 5,
  "email": "user@example.com",
  "iat": 1699520000,
  "exp": 1699606400
}
```

## Error Handling

### Backend Error Handling Strategy

#### 1. Global Error Handler Middleware
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});
```

#### 2. Controller-Level Error Handling
Todos los controllers usan try-catch y devuelven respuestas apropiadas:
- 400 - Bad Request (validación fallida)
- 401 - Unauthorized (sin token o credenciales inválidas)
- 403 - Forbidden (token inválido/expirado)
- 404 - Not Found (recurso no existe)
- 409 - Conflict (email duplicado)
- 500 - Internal Server Error (errores de DB o externos)

#### 3. Database Error Handling
- Catch de errores de conexión en pool.query()
- Retry logic para conexión inicial (espera a que DB esté lista)
- Logging de errores SQL

#### 4. External API Error Handling
- YouTube API: Catch de errores de red, devuelve array vacío
- Timeout de 5 segundos para llamadas externas
- Logging de fallos de API externa

### Frontend Error Handling Strategy

#### 1. API Call Error Handling
- Uso de try-catch en todas las llamadas fetch
- Verificación de response.ok antes de parsear JSON
- Mostrar mensajes de error al usuario mediante estado local

#### 2. Authentication Error Handling
- Interceptar 401/403 y redirigir a login
- Limpiar token inválido de localStorage
- Mostrar mensaje de sesión expirada

#### 3. Form Validation
- Validación client-side antes de enviar
- Mostrar errores de validación inline
- Deshabilitar botón de submit durante envío

## Testing Strategy

### Backend Testing

#### Unit Tests
- **Auth Controller:** Verificar hashing de contraseñas, generación de JWT
- **Middleware:** Verificar validación de tokens válidos/inválidos/expirados
- **YouTube Service:** Mock de API, verificar formato de respuesta

#### Integration Tests
- **Auth Flow:** Registro → Login → Acceso a ruta protegida
- **Boss Endpoints:** GET /api/bosses, GET /api/bosses/:id
- **Comment Flow:** Crear comentario autenticado → Recuperar comentarios

#### Database Tests
- Verificar creación de tablas con script init
- Verificar constraints (foreign keys, unique)
- Verificar datos de seed

### Frontend Testing

#### Component Tests
- **BossList:** Renderiza lista de jefes correctamente
- **CommentForm:** Solo visible para usuarios autenticados
- **AuthContext:** Login/logout actualiza estado correctamente

#### Integration Tests
- **Navigation Flow:** Home → Boss Detail → Login → Comment
- **Auth Flow:** Register → Login → Create Comment → Logout

### Docker Testing

#### Container Tests
- Verificar que todos los contenedores inician correctamente
- Verificar conectividad entre contenedores
- Verificar variables de entorno se pasan correctamente
- Verificar volúmenes persisten datos

## Docker Configuration Details

### docker-compose.yml Structure

```yaml
version: '3.8'

services:
  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: darksouls_wiki
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:postgres@database:5432/darksouls_wiki
      JWT_SECRET: your-secret-key-change-in-production
      YOUTUBE_API_KEY: ${YOUTUBE_API_KEY}
      CORS_ORIGIN: http://localhost:5173
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      database:
        condition: service_healthy

  frontend:
    build: ./frontend
    environment:
      VITE_API_URL: http://localhost:3000
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:

networks:
  default:
    name: darksouls-network
```

### Backend Dockerfile Strategy

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Frontend Dockerfile Strategy

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
```

### Initialization Script (init.sql)

El script debe:
1. Crear tablas en orden (users, bosses, comments)
2. Insertar 3-4 jefes con datos completos
3. Ser idempotente (usar IF NOT EXISTS o DROP IF EXISTS)

Jefes de ejemplo:
- Artorias the Abysswalker
- Ornstein and Smough
- Gwyn, Lord of Cinder
- Sif, the Great Grey Wolf

## Security Considerations

### Password Security
- Bcrypt con 10 salt rounds mínimo
- Nunca almacenar contraseñas en texto plano
- Nunca loggear contraseñas

### JWT Security
- Secret key fuerte (mínimo 32 caracteres)
- Expiración de 24 horas
- Almacenar en localStorage (considerar httpOnly cookies para producción)
- Verificar firma en cada request

### CORS Configuration
- Whitelist específico del dominio frontend
- No usar wildcard (*) en producción

### Environment Variables
- Nunca commitear .env al repositorio
- Usar .env.example como template
- YouTube API key solo en backend
- Database credentials solo en docker-compose

### SQL Injection Prevention
- Usar queries parametrizadas con pg
- Nunca concatenar strings para queries
- Validar y sanitizar inputs

### Rate Limiting (Future Enhancement)
- Implementar rate limiting en endpoints públicos
- Limitar intentos de login

## Performance Considerations

### Database
- Índices en foreign keys (boss_id, user_id en comments)
- Índice en email de users para login rápido
- Connection pooling con pg

### Frontend
- Lazy loading de componentes con React.lazy
- Optimización de imágenes (considerar CDN)
- Caching de lista de jefes

### Backend
- Caching de respuestas de YouTube API (considerar Redis)
- Compresión de respuestas con compression middleware
- Keep-alive connections

### Docker
- Imágenes Alpine para tamaño reducido
- Multi-stage builds para frontend
- Health checks para startup ordenado
