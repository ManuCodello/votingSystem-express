import express from 'express';
import topicRoutes from './routes/topic.routes.js';
import subtopicRoutes from './routes/subtopic.routes.js';
import { getTopicJSON } from './controllers/topic.controller.js';

const app = express();
const PORT = 3000;

// Sirve archivos estáticos (CSS, JS de cliente, imágenes) desde la carpeta 'public'
app.use(express.static('public'));

// Middleware para parsear el cuerpo de solicitudes con formato url-encoded (formularios)
app.use(express.urlencoded({ extended: true }));

// MIDDLEWARE para parsear cuerpos de solicitud JSON 
app.use(express.json());

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// Se añade esta ruta para manejar las peticiones a la página principal.
app.get('/', (req, res) => {
  res.redirect('/topics');
});

// Ruta API para obtener un tema específico en JSON (usada por el front-end)
app.get('/api/topics/:id', getTopicJSON);

// Rutas principales de la aplicación
app.use('/topics', topicRoutes);
app.use('/subtopics', subtopicRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
