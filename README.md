# Aplicación Web de Tecnologías de Información

## Descripción
Aplicación web desarrollada con Node.js, Express y Docker que implementa mecanismos de seguridad, servicios web propios y de terceros, con integración completa de contenedores para despliegue en producción.

## Características

### 🔒 Mecanismos de Seguridad
- **Autenticación JWT**: Sistema de autenticación basado en tokens JSON Web Token
- **Encriptación de contraseñas**: Uso de bcrypt para hash seguro de contraseñas
- **Validación de datos**: Validación de entrada con express-validator
- **Rate limiting**: Limitación de peticiones para prevenir ataques DDoS
- **Helmet**: Seguridad de headers HTTP
- **CORS**: Control de acceso entre domininos
- **HTTPS ready**: Configuración preparada para SSL/TLS

### 🌐 Web Services de Terceros
- **Servicio de Clima**: API de clima con datos de temperatura, humedad y pronóstico
- **Servicio de Noticias**: API de noticias con categorías de tecnología

### ⚙️ Web Services Propios
- **Gestión de Usuarios**: CRUD completo de usuarios con roles
- **Gestión de Productos**: CRUD de productos tecnológicos
- **Autenticación**: Sistema completo de registro y login
- **API RESTful**: Arquitectura RESTful con endpoints documentados

### 🐳 Docker y DevOps
- **Contenedorización**: Aplicación completamente contenedorizada
- **Orquestación**: Docker Compose con múltiples servicios
- **Base de datos**: MongoDB en contenedor
- **Cache**: Redis para mejorar rendimiento
- **Proxy reverso**: Nginx como balanceador de carga
- **Monitoreo**: Prometheus y Grafana para métricas
- **SSL/TLS**: Configuración preparada para certificados SSL

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Base de datos**: MongoDB
- **Cache**: Redis
- **Contenedores**: Docker, Docker Compose
- **Monitoreo**: Prometheus, Grafana
- **Proxy**: Nginx
- **Seguridad**: JWT, bcrypt, Helmet, CORS

## Instalación y Uso

### Requisitos Previos
- Docker y Docker Compose instalados
- Puerto 80, 3000, 9090 y 3001 disponibles

### Despliegue con Docker

1. Clonar el repositorio:
```bash
git clone https://github.com/Juan789v-F/JuanDanielFloresEspinozaUnidad3.git
cd JuanDanielFloresEspinozaUnidad3
```

2. Construir y ejecutar los contenedores:
```bash
docker-compose up -d
```

3. La aplicación estará disponible en:
- Aplicación principal: http://localhost
- Monitoreo (Grafana): http://localhost:3001
- Métricas (Prometheus): http://localhost:9090

### Desarrollo Local

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

## Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/verify` - Verificar token

### Usuarios
- `GET /api/users` - Obtener todos los usuarios (Admin)
- `GET /api/users/:id` - Obtener usuario específico
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (Admin)

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto específico
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/:id` - Actualizar producto (Admin)
- `DELETE /api/products/:id` - Eliminar producto (Admin)

### Servicios de Terceros
- `GET /api/weather/:city` - Clima por ciudad
- `GET /api/weather/forecast/:city` - Pronóstico 5 días
- `GET /api/news` - Noticias de tecnología
- `GET /api/news/search/:keyword` - Buscar noticias

## Estructura del Proyecto

```
.
├── docker-compose.yml      # Configuración de servicios Docker
├── Dockerfile              # Imagen de la aplicación Node.js
├── nginx/
│   └── nginx.conf         # Configuración de Nginx
├── docker/
│   └── prometheus.yml     # Configuración de Prometheus
├── public/                # Archivos estáticos del frontend
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── routes/                # Rutas de la API
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── weather.js
│   └── news.js
├── middleware/            # Middleware de Express
├── models/               # Modelos de datos
├── logs/                 # Archivos de log
├── ssl/                  # Certificados SSL
├── server.js             # Servidor principal
├── package.json          # Dependencias del proyecto
├── .env                  # Variables de entorno
└── README.md            # Este archivo
```

## Seguridad

La aplicación implementa múltiples capas de seguridad:

1. **Autenticación y Autorización**: JWT con expiración configurable
2. **Validación de Entrada**: Validación exhaustiva de todos los datos de entrada
3. **Encriptación**: Contraseñas hasheadas con bcrypt (12 rounds)
4. **Rate Limiting**: Limitación de peticiones por IP
5. **Headers de Seguridad**: Configuración de headers con Helmet
6. **CORS**: Control de acceso entre dominios
7. **Logs de Seguridad**: Registro de actividades sospechosas

## Monitoreo y Métricas

- **Prometheus**: Recolección de métricas de la aplicación
- **Grafana**: Visualización de dashboards con métricas en tiempo real
- **Health Checks**: Endpoints de salud para monitoreo
- **Logs Centralizados**: Sistema de logging estructurado

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Autor

**Juan Daniel Flores Espinoza**
- GitHub: [@Juan789v-F](https://github.com/Juan789v-F)
- Proyecto: [JuanDanielFloresEspinozaUnidad3](https://github.com/Juan789v-F/JuanDanielFloresEspinozaUnidad3)

---

**Nota**: Este proyecto fue desarrollado como parte de las actividades académicas de la Unidad 3 de Tecnologías de Información.