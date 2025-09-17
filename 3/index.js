import express from 'express';
import topicRoutes from './routes/topic.routes.js';

const app = express();
const PORT = 3000;

// Sirve archivos estáticos (CSS, JS de cliente, imágenes) desde la carpeta 'public'
app.use(express.static('public'));

// Middleware para parsear el cuerpo de solicitudes con formato url-encoded (formularios)
app.use(express.urlencoded({ extended: true }));

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// Rutas
app.use('/', topicRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

