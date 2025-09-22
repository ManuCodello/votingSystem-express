// routes/topic.routes.js
import { Router } from 'express';
import { 
  renderTopicsPage, 
  createTopic, 
  voteForTopic, 
  renderTopicDetailPage, 
  getTopicJSON, 
  updateTopic, 
  deleteTopic,
} from '../controllers/topic.controller.js';

import { createSubtopic } from '../controllers/subtopic.controller.js';

const router = Router();

// --- Rutas para renderizar vistas (HTML) ---
router.get('/', renderTopicsPage);
router.get('/:id', renderTopicDetailPage);

// --- Rutas para la API (manejo de datos) ---

// OBTENER un tema específico (JSON)
router.get('/api/topics/:id', getTopicJSON); 

// CREAR un nuevo tema
router.post('/', createTopic);

// ACTUALIZAR un tema existente
router.put('/:id', updateTopic);

// ELIMINAR un tema existente
router.delete('/:id', deleteTopic);

// VOTAR por un tema (POST es adecuado aquí porque es una acción)
router.post('/:id/vote', voteForTopic);

// Llama directamente al controlador, sin importar el otro router.
router.post('/:topic_id/subtopics', createSubtopic);


export default router;

