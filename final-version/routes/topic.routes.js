// routes/topic.routes.js
import { Router } from 'express';
import { renderTopicsPage, createTopic, voteForTopic, renderTopicDetailPage } from '../controllers/topic.controller.js';

const router = Router();

router.get('/', renderTopicsPage);
router.post('/topics', createTopic);
router.get('/topics/:id', renderTopicDetailPage);
router.post('/topics/:id/vote', voteForTopic);

export default router;

