import { Router } from 'express';
import { renderTopicsPage, createTopic, voteForTopic, deleteTopic } from '../controllers/topic.controller.js';

const router = Router();
router.get('/', renderTopicsPage);

router.post('/topics', createTopic);

router.post('/topics/:id/vote', voteForTopic);

router.post('/topics/:id/delete', deleteTopic);

export default router;


