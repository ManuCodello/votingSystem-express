// controllers/subtopic.controller.js
import * as subtopicModel from '../models/subtopic.model.js';

// Una función auxiliar para obtener y devolver la lista actualizada
const getAndSendSubtopics = async (res, topic_id) => {
  const subtopics = await subtopicModel.getSubtopicsForTopic(topic_id);
  res.json(subtopics);
};

export const createSubtopic = async (req, res) => {
  const { topic_id } = req.params;
  const { title, link } = req.body;
  await subtopicModel.addSubtopic(title, link, topic_id);
  await getAndSendSubtopics(res, topic_id);
};

export const updateSubtopic = async (req, res) => {
  const { id } = req.params;
  const { title, link, topic_id } = req.body;
  await subtopicModel.updateSubtopic(id, title, link);
  await getAndSendSubtopics(res, topic_id);
};

export const deleteSubtopic = async (req, res) => {
  const { id } = req.params;
  const { topic_id } = req.body;
  await subtopicModel.deleteSubtopic(id);
  await getAndSendSubtopics(res, topic_id);
};

export const upvote = async (req, res) => {
  const { id } = req.params;
  const { topic_id } = req.body;
  await subtopicModel.upvoteSubtopic(id);
  await getAndSendSubtopics(res, topic_id);
};

export const downvote = async (req, res) => {
  const { id } = req.params;
  const { topic_id } = req.body;
  await subtopicModel.downvoteSubtopic(id);
  await getAndSendSubtopics(res, topic_id);
};