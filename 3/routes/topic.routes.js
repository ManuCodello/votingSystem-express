import { Router } from 'express';
import { renderTopicsPage, createTopic, voteForTopic, deleteTopic, getSingleTopic, updateSingleTopic } from '../controllers/topic.controller.js';

const router = Router();
router.get('/', renderTopicsPage);

router.post('/topics', createTopic);

router.post('/topics/:id/vote', voteForTopic);

router.post('/topics/:id/delete', deleteTopic);

// Ruta para obtener los datos de un solo tema
router.get('/topics/:id', getSingleTopic);
// Ruta para actualizar un tema
router.post('/topics/:id/update', updateSingleTopic);

export default router;



