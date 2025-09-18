// routes/topic.routes.js
import { Router } from 'express';
import { renderTopicsPage, createTopic, voteForTopic, renderTopicDetailPage, getTopicJSON, updateTopic ,deleteTopic } from '../controllers/topic.controller.js';

const router = Router();

router.get('/', renderTopicsPage);
router.post('/topics', createTopic);
router.get('/topics/:id', renderTopicDetailPage);
router.post('/topics/:id/vote', voteForTopic);

router.post('/topics/:id/update', updateTopic); // <-- Nueva ruta para actualizar
router.post('/topics/:id/delete', deleteTopic); // <-- Nueva ruta para eliminar

// Ruta API para obtener datos de un solo tema en JSON
router.get('/api/topics/:id', getTopicJSON); // <-- Nueva ruta API

export default router;

