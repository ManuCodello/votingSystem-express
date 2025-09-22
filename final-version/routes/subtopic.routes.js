// routes/subtopic.routes.js
import { Router } from 'express';
import { 
  createSubtopic, 
  updateSubtopic, 
  deleteSubtopic, 
  upvote, 
  downvote 
} from '../controllers/subtopic.controller.js';

// Usamos mergeParams para poder acceder a :topic_id desde las rutas anidadas
const router = Router({ mergeParams: true });

// --- Rutas para la API de Subtemas ---

// CREAR un nuevo subtema dentro de un tema específico
// POST /topics/:topic_id/subtopics
router.post('/', createSubtopic);

// ACTUALIZAR un subtema existente
// PUT /subtopics/:id
router.put('/:id', updateSubtopic);

// ELIMINAR un subtema existente
// DELETE /subtopics/:id
router.delete('/:id', deleteSubtopic);

// VOTAR por un subtema (upvote/downvote)
// Usar POST aquí es correcto porque estás realizando una ACCIÓN que modifica el estado.
router.post('/:id/upvote', upvote);
router.post('/:id/downvote', downvote);

export default router;