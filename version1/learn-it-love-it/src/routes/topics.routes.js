const express = require('express');
const router = express.Router();
const controller = require('../controllers/topics.controller');

router.get('/', controller.renderTopicsPage);
router.post('/topics', controller.createTopic);
router.post('/topics/:id/delete', controller.deleteTopic);
router.post('/topics/:id/vote', controller.upvoteTopic);
router.post('/topics/:topicId/links', controller.createLink);
router.post('/topics/:topicId/links/:linkId/delete', controller.deleteLink);
router.post('/topics/:topicId/links/:linkId/vote', controller.upvoteLink);

module.exports = router;
