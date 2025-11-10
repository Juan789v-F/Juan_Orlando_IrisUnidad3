# 🔥 Dark Souls Wiki

Una aplicación web mini-wiki con temática de Dark Souls que permite a los usuarios explorar información sobre jefes del juego, ver videos relacionados de YouTube y participar mediante comentarios autenticados.

## ✨ Características Visuales

### 🎨 Diseño Profesional
- **Hero Banner Animado**: Banner principal con imagen de fondo, efectos de brillo y estadísticas
- **Tema Dark Souls Auténtico**: Paleta de colores oscura con acentos dorados inspirados en el juego
- **Animaciones Suaves**: Transiciones y efectos hover en todos los elementos
- **Efectos de Iluminación**: Sombras doradas y efectos de resplandor en elementos clave
- **Tipografía Medieval**: Fuentes Cinzel y MedievalSharp para títulos épicos

### 🎮 Características Funcionales

- **Exploración de Jefes**: Visualiza una lista de jefes icónicos con cards interactivas
- **Detalles Completos**: Accede al lore completo de cada jefe con diseño inmersivo
- **Videos de YouTube**: Integración con YouTube API para mostrar videos relevantes
- **Sistema de Comentarios**: Los usuarios autenticados pueden dejar comentarios
- **Autenticación Segura**: Sistema completo de registro y login con JWT y bcrypt
- **Arquitectura Dockerizada**: Toda la aplicación se ejecuta en contenedores Docker
- **Diseño Responsive**: Optimizado para desktop, tablet y móvil

## 📸 Capturas de Pantalla

### Página Principal
- Hero banner con efectos de fuego animados
- Grid de jefes con imágenes y efectos hover
- Navegación con tema Dark Souls

### Detalles de Jefe
- Imagen grande del jefe con borde dorado brillante
- Lore completo con diseño inmersivo
- Videos relacionados de YouTube
- Sistema de comentarios integrado

### Características de Diseño
- **Efectos de Hover**: Las cards de jefes se elevan y brillan al pasar el mouse
- **Animaciones**: Títulos con efecto de resplandor pulsante
- **Iconos Temáticos**: Emojis de fuego 🔥, espadas ⚔️ y sol ☀️
- **Footer Mejorado**: Footer con múltiples secciones y enlaces

## 🏗️ Stack Tecnológico

### Frontend
- React 18 con Vite
- React Router para navegación
- Axios para peticiones HTTP
- CSS personalizado con tema Dark Souls

### Backend
- Node.js con Express
- PostgreSQL para base de datos
- JWT para autenticación
- Bcrypt para hashing de contraseñas
- Axios para integración con YouTube API

### DevOps
- Docker & Docker Compose
- Nginx para servir el frontend
- PostgreSQL 15 Alpine

## 📋 Requisitos Previos

- Docker Desktop instalado
- Docker Compose instalado
- YouTube API Key (opcional, para funcionalidad de videos)

## 🚀 Instalación y Despliegue

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd darksouls-wiki
```

### 2. Configurar YouTube API Key (Opcional)

Para habilitar la funcionalidad de videos de YouTube:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la YouTube Data API v3
4. Crea credenciales (API Key)
5. Copia tu API key

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
YOUTUBE_API_KEY=tu-api-key-de-youtube-aqui
```

**Nota**: Si no configuras la YouTube API key, la aplicación funcionará normalmente pero no mostrará videos.

### 4. Desplegar con Docker Compose

```bash
docker-compose up --build
```

Este comando:
- Construye las imágenes de Docker para frontend y backend
- Inicia PostgreSQL y ejecuta el script de inicialización
- Inicia el backend en el puerto 3000
- Inicia el frontend en el puerto 5173

### 5. Acceder a la Aplicación

Una vez que todos los contenedores estén corriendo:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

## 🎯 Uso de la Aplicación

### Explorar Jefes
1. Abre http://localhost:5173
2. Verás una lista de jefes de Dark Souls
3. Haz clic en cualquier jefe para ver sus detalles completos

### Registrarse y Comentar
1. Haz clic en "Register" en la navegación
2. Crea una cuenta con email y contraseña
3. Serás redirigido automáticamente después del registro
4. Navega a la página de un jefe
5. Deja un comentario en la sección de comentarios

### Ver Videos
- Los videos de YouTube aparecen automáticamente en la página de detalles de cada jefe
- Haz clic en cualquier video para verlo en YouTube

## 📁 Estructura del Proyecto

```
darksouls-wiki/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuración de PostgreSQL
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticación
│   │   ├── bossController.js    # Lógica de jefes
│   │   └── commentController.js # Lógica de comentarios
│   ├── middleware/
│   │   └── auth.js              # Middleware JWT
│   ├── routes/
│   │   ├── auth.js              # Rutas de autenticación
│   │   ├── bosses.js            # Rutas de jefes
│   │   └── comments.js          # Rutas de comentarios
│   ├── services/
│   │   └── youtubeService.js    # Integración YouTube API
│   ├── init.sql                 # Script de inicialización DB
│   ├── server.js                # Punto de entrada
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── contexts/            # Context API (Auth)
│   │   ├── pages/               # Páginas de la aplicación
│   │   ├── services/            # Servicios (API client)
│   │   ├── App.jsx              # Componente principal
│   │   ├── main.jsx             # Punto de entrada
│   │   └── index.css            # Estilos globales
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Jefes
- `GET /api/bosses` - Obtener lista de jefes
- `GET /api/bosses/:id` - Obtener detalles de un jefe
- `GET /api/bosses/:id/videos` - Obtener videos de YouTube de un jefe

### Comentarios
- `GET /api/comments/:boss_id` - Obtener comentarios de un jefe
- `POST /api/comments` - Crear comentario (requiere autenticación)

## 🔒 Seguridad

- **Contraseñas**: Hasheadas con bcrypt (10 salt rounds)
- **JWT**: Tokens con expiración de 24 horas
- **CORS**: Configurado para aceptar solo peticiones del frontend
- **Variables de Entorno**: Credenciales sensibles nunca en el código
- **SQL Injection**: Prevención mediante queries parametrizadas

## 🛠️ Comandos Útiles

### Detener los contenedores
```bash
docker-compose down
```

### Ver logs
```bash
docker-compose logs -f
```

### Reconstruir sin caché
```bash
docker-compose build --no-cache
docker-compose up
```

### Acceder a la base de datos
```bash
docker exec -it darksouls-db psql -U postgres -d darksouls_wiki
```

### Limpiar volúmenes (⚠️ elimina datos)
```bash
docker-compose down -v
```

## 🎨 Personalización

### Agregar Más Jefes
Edita `backend/init.sql` y agrega más registros en la tabla `bosses`:

```sql
INSERT INTO bosses (name, short_description, lore, image_url) VALUES
('Boss Name', 'Short description', 'Full lore text', 'https://image-url.com');
```

### Cambiar Tema de Colores
Edita las variables CSS en `frontend/src/index.css`:

```css
:root {
  --bg-primary: #0a0a0a;
  --accent-gold: #d4af37;
  /* ... más variables */
}
```

## 🐛 Troubleshooting

### El backend no se conecta a la base de datos
- Verifica que el contenedor de PostgreSQL esté corriendo: `docker ps`
- Revisa los logs: `docker-compose logs database`
- El backend tiene retry logic, espera unos segundos

### Los videos de YouTube no aparecen
- Verifica que configuraste la `YOUTUBE_API_KEY` en el archivo `.env`
- Verifica que la API key es válida en Google Cloud Console
- Revisa los logs del backend: `docker-compose logs backend`

### Error de CORS
- Verifica que `CORS_ORIGIN` en docker-compose.yml coincida con la URL del frontend
- Por defecto: `http://localhost:5173`

## 📝 Datos de Ejemplo

La aplicación viene precargada con 4 jefes icónicos:
- Artorias the Abysswalker
- Ornstein and Smough
- Gwyn, Lord of Cinder
- Sif, the Great Grey Wolf

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia ISC.

## 🙏 Agradecimientos

- FromSoftware por crear Dark Souls
- La comunidad de Dark Souls por mantener viva la llama
- Unsplash por las imágenes de ejemplo

---

**Praise the Sun!** ☀️
