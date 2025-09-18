// routes/subtopic.routes.js
import { Router } from 'express';
import { createSubtopic, updateSubtopic, deleteSubtopic, upvote, downvote } from '../controllers/subtopic.controller.js';

const router = Router();

router.post('/topics/:topic_id/subtopics', createSubtopic);
router.post('/subtopics/:id/update', updateSubtopic);
router.post('/subtopics/:id/delete', deleteSubtopic);
router.post('/subtopics/:id/upvote', upvote);
router.post('/subtopics/:id/downvote', downvote);

export default router;