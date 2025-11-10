# Implementation Plan - Dark Souls Wiki

- [x] 1. Configurar estructura base del proyecto y Docker


  - Crear estructura de carpetas: `/frontend`, `/backend`
  - Crear `docker-compose.yml` en la raíz con servicios database, backend y frontend
  - Configurar volúmenes para persistencia de PostgreSQL
  - Configurar red Docker personalizada `darksouls-network`
  - Definir health checks para el servicio database
  - _Requirements: 6.1, 6.4, 6.6_



- [ ] 2. Implementar base de datos y script de inicialización
  - Crear `backend/init.sql` con tablas users, bosses y comments
  - Definir constraints, foreign keys y índices apropiados
  - Insertar datos de seed para 3-4 jefes de Dark Souls (Artorias, Ornstein & Smough, Gwyn, Sif)
  - Incluir nombres, descripciones cortas, lore completo e image_urls




  - Hacer el script idempotente con DROP TABLE IF EXISTS
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 3. Configurar backend Node.js/Express
- [ ] 3.1 Crear estructura base del backend
  - Crear `backend/package.json` con dependencias: express, pg, bcrypt, jsonwebtoken, cors, helmet, dotenv, axios


  - Crear `backend/Dockerfile` con Node.js 18 Alpine
  - Crear `backend/server.js` como punto de entrada
  - Configurar middleware global: cors, express.json, helmet
  - Configurar puerto 3000 y lectura de variables de entorno




  - _Requirements: 6.2, 6.3_

- [ ] 3.2 Implementar conexión a base de datos
  - Crear `backend/config/database.js` con pool de conexiones PostgreSQL
  - Leer DATABASE_URL de variables de entorno


  - Implementar función testConnection() con retry logic
  - Exportar pool para uso en controllers
  - _Requirements: 6.7_

- [ ] 4. Implementar sistema de autenticación
- [x] 4.1 Crear controlador de autenticación


  - Crear `backend/controllers/authController.js`
  - Implementar función `register`: validar email/password, hashear con bcrypt (10 rounds), insertar en DB
  - Implementar función `login`: validar credenciales, comparar hash, generar JWT con expiración 24h
  - Manejar errores: 409 para email duplicado, 401 para credenciales inválidas




  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2_

- [ ] 4.2 Crear middleware de autenticación JWT
  - Crear `backend/middleware/auth.js`
  - Extraer token del header Authorization (formato "Bearer <token>")


  - Verificar token con jwt.verify() y JWT_SECRET
  - Adjuntar req.user con payload decodificado (userId, email)
  - Devolver 401 si no hay token, 403 si token es inválido/expirado
  - _Requirements: 4.3, 2.3, 2.4_





- [ ] 4.3 Crear rutas de autenticación
  - Crear `backend/routes/auth.js`
  - Definir POST /api/auth/register → authController.register
  - Definir POST /api/auth/login → authController.login
  - Montar rutas en server.js bajo /api/auth
  - _Requirements: 3.1, 3.2, 3.3, 3.4_



- [ ] 5. Implementar gestión de jefes
- [ ] 5.1 Crear controlador de jefes
  - Crear `backend/controllers/bossController.js`
  - Implementar `getAllBosses`: query SELECT id, name, short_description, image_url FROM bosses


  - Implementar `getBossById`: query con WHERE id = $1, devolver 404 si no existe




  - Manejar errores de base de datos con try-catch
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 5.2 Crear rutas de jefes
  - Crear `backend/routes/bosses.js`
  - Definir GET /api/bosses → bossController.getAllBosses


  - Definir GET /api/bosses/:id → bossController.getBossById
  - Montar rutas en server.js bajo /api/bosses
  - _Requirements: 1.1, 1.2_





- [ ] 6. Implementar integración con YouTube API
- [ ] 6.1 Crear servicio de YouTube
  - Crear `backend/services/youtubeService.js`
  - Implementar función `searchVideos(query, maxResults = 3)`
  - Usar axios para llamar a YouTube Data API v3 endpoint /search
  - Parámetros: part=snippet, q=query, type=video, maxResults, key=YOUTUBE_API_KEY


  - Transformar respuesta a formato {videoId, title, thumbnail, url}
  - Manejar errores devolviendo array vacío, timeout de 5 segundos
  - _Requirements: 5.1, 5.2, 5.3, 4.5_





- [ ] 6.2 Integrar YouTube en controlador de jefes
  - Agregar método `getBossVideos` en bossController.js
  - Obtener nombre del jefe desde DB usando boss_id
  - Llamar a youtubeService.searchVideos con query "Dark Souls [nombre del jefe]"
  - Devolver array de 3 videos o array vacío si hay error
  - _Requirements: 5.1, 5.2, 5.3_



- [ ] 6.3 Crear ruta para videos de jefes
  - Agregar GET /api/bosses/:id/videos → bossController.getBossVideos en routes/bosses.js
  - _Requirements: 5.1_



- [ ] 7. Implementar sistema de comentarios
- [ ] 7.1 Crear controlador de comentarios
  - Crear `backend/controllers/commentController.js`
  - Implementar `getCommentsByBoss`: query con JOIN a users, SELECT comments.*, users.email
  - Implementar `createComment`: insertar con boss_id, user_id (de req.user), content




  - Validar que boss_id existe antes de crear comentario
  - Devolver 201 con comentario creado
  - _Requirements: 2.1, 2.2_

- [ ] 7.2 Crear rutas de comentarios
  - Crear `backend/routes/comments.js`


  - Definir GET /api/comments/:boss_id → commentController.getCommentsByBoss
  - Definir POST /api/comments → [authMiddleware], commentController.createComment
  - Montar rutas en server.js bajo /api/comments
  - _Requirements: 2.1, 2.2, 2.3, 2.4_


- [ ] 8. Configurar frontend React con Vite
- [ ] 8.1 Crear estructura base del frontend
  - Crear proyecto Vite con template React en carpeta `/frontend`
  - Crear `frontend/package.json` con dependencias: react, react-dom, react-router-dom, axios
  - Crear `frontend/Dockerfile` multi-stage: build con Node, serve con Nginx
  - Crear `frontend/nginx.conf` para servir en puerto 5173




  - Configurar VITE_API_URL en variables de entorno
  - _Requirements: 6.1, 6.2_

- [ ] 8.2 Configurar routing y estructura de carpetas
  - Crear estructura: `/src/components`, `/src/contexts`, `/src/pages`, `/src/services`


  - Configurar React Router en `App.jsx` con rutas: /, /boss/:id, /login, /register
  - Crear componente Layout con navegación básica
  - _Requirements: 1.4, 1.5_

- [ ] 9. Implementar autenticación en frontend
- [ ] 9.1 Crear contexto de autenticación
  - Crear `frontend/src/contexts/AuthContext.jsx`

  - Implementar estado: user, token (leer de localStorage al iniciar)
  - Implementar método `login(email, password)`: POST /api/auth/login, guardar token en localStorage
  - Implementar método `register(email, password)`: POST /api/auth/register
  - Implementar método `logout()`: limpiar localStorage y estado
  - Proveer contexto en App.jsx

  - _Requirements: 3.5_

- [ ] 9.2 Crear servicio de API
  - Crear `frontend/src/services/api.js`
  - Configurar axios con baseURL desde VITE_API_URL
  - Crear interceptor para agregar Authorization header con token de localStorage





  - Crear interceptor de respuesta para manejar 401/403 y redirigir a login
  - _Requirements: 2.3, 2.4_

- [ ] 9.3 Crear componentes de autenticación
  - Crear `frontend/src/components/LoginForm.jsx`: formulario con email/password, llamar a authContext.login
  - Crear `frontend/src/components/RegisterForm.jsx`: formulario con email/password/confirmPassword



  - Validar que passwords coincidan antes de enviar
  - Mostrar errores de validación y errores de API
  - Redirigir a home después de login/register exitoso
  - _Requirements: 3.5_

- [ ] 10. Implementar visualización de jefes
- [ ] 10.1 Crear componente de lista de jefes
  - Crear `frontend/src/components/BossList.jsx`
  - Hacer GET /api/bosses al montar componente
  - Renderizar grid de cards con imagen, nombre y descripción corta
  - Hacer cada card clicable para navegar a /boss/:id
  - Manejar estados de loading y error
  - _Requirements: 1.4, 1.5_

- [ ] 10.2 Crear componente de detalles de jefe
  - Crear `frontend/src/components/BossDetail.jsx`
  - Obtener id de URL params con useParams
  - Hacer GET /api/bosses/:id al montar
  - Renderizar imagen grande, nombre, descripción y lore completo
  - Manejar 404 si jefe no existe
  - _Requirements: 1.5_

- [ ] 11. Implementar integración de YouTube en frontend
  - Agregar llamada GET /api/bosses/:id/videos en BossDetail.jsx
  - Crear sección "Videos Relacionados" debajo del lore
  - Renderizar 3 videos con thumbnail clicable, título y enlace a YouTube
  - Manejar caso de array vacío mostrando mensaje "No hay videos disponibles"
  - _Requirements: 5.4_

- [ ] 12. Implementar sistema de comentarios en frontend
- [ ] 12.1 Crear componente de lista de comentarios
  - Crear `frontend/src/components/CommentList.jsx`
  - Recibir array de comentarios como prop
  - Renderizar cada comentario con autor (email), contenido y fecha formateada
  - Mostrar mensaje "No hay comentarios" si array está vacío
  - _Requirements: 2.5_

- [ ] 12.2 Crear componente de formulario de comentarios
  - Crear `frontend/src/components/CommentForm.jsx`
  - Mostrar solo si usuario está autenticado (usar AuthContext)
  - Textarea para contenido, botón de enviar
  - POST /api/comments con boss_id y content
  - Callback onCommentAdded para refrescar lista
  - Deshabilitar botón durante envío
  - _Requirements: 2.2, 2.3_

- [ ] 12.3 Integrar comentarios en detalles de jefe
  - Agregar GET /api/comments/:boss_id en BossDetail.jsx
  - Renderizar CommentList con comentarios obtenidos
  - Renderizar CommentForm debajo de la lista
  - Refrescar comentarios después de crear uno nuevo
  - _Requirements: 2.1, 2.5_

- [ ] 13. Implementar manejo de errores global
  - Crear componente ErrorBoundary para errores de React
  - Agregar middleware de error global en backend/server.js
  - Implementar logging de errores en backend (console.error)
  - Agregar mensajes de error user-friendly en frontend
  - _Requirements: 1.3, 2.3, 2.4, 3.2, 3.4_

- [ ] 14. Agregar estilos y tema Dark Souls
  - Crear `frontend/src/index.css` con tema oscuro inspirado en Dark Souls
  - Paleta de colores: negros, grises oscuros, dorados para acentos
  - Estilizar componentes: cards de jefes, formularios, botones
  - Agregar fuente medieval/gótica para títulos
  - Hacer diseño responsive con CSS Grid/Flexbox
  - _Requirements: 1.4, 1.5_

- [ ] 15. Configurar variables de entorno y documentación
  - Crear `backend/.env.example` con DATABASE_URL, JWT_SECRET, YOUTUBE_API_KEY, CORS_ORIGIN
  - Crear `frontend/.env.example` con VITE_API_URL
  - Crear `README.md` en raíz con instrucciones de despliegue
  - Documentar comando `docker-compose up --build`
  - Documentar cómo obtener YouTube API key
  - Listar puertos expuestos: frontend (5173), backend (3000), database (5432)
  - _Requirements: 6.4, 6.6_

- [ ] 16. Integración final y verificación
  - Ejecutar `docker-compose up --build` y verificar que todos los servicios inician
  - Verificar que database se inicializa con datos de seed
  - Probar flujo completo: ver jefes → ver detalles → registrarse → login → crear comentario
  - Verificar que videos de YouTube se cargan correctamente
  - Verificar que rutas protegidas rechazan requests sin token
  - Verificar CORS permite requests desde frontend
  - _Requirements: 6.4, 6.7_
