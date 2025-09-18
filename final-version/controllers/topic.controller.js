// controllers/topic.controller.js
import * as topicModel from '../models/topic.model.js';
import * as subtopicModel from '../models/subtopic.model.js';

export const renderTopicsPage = async (req, res) => {
  try {
    const topics = await topicModel.getTopics();
    res.render('index', { topics });
  } catch (error) {
    res.status(500).send("Error al cargar la página de temas.");
  }
};

export const createTopic = async (req, res) => {
  const { title } = req.body;
  if (title && title.trim() !== '') {
    await topicModel.addTopic(title);
  }
  res.redirect('/');
};

export const voteForTopic = async (req, res) => {
  const { id } = req.params;
  await topicModel.incrementVote(id);
  const topics = await topicModel.getTopics();
  res.json(topics);
};

// 👇 NUEVA FUNCIÓN: Obtiene datos de un tema como JSON para la modal de edición
export const getTopicJSON = async (req, res) => {
  const { id } = req.params;
  const topic = await topicModel.getTopicById(id);
  res.json(topic);
};

// 👇 NUEVA FUNCIÓN: Actualiza el título de un tema
export const updateTopic = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  await topicModel.updateTopic(id, title);
  const topics = await topicModel.getTopics();
  res.json(topics);
};

// 👇 NUEVA FUNCIÓN: Elimina un tema y responde con la lista actualizada
export const deleteTopic = async (req, res) => {
    const { id } = req.params;
    await topicModel.removeTopic(id);
    const topics = await topicModel.getTopics();
    res.json(topics);
};

export const renderTopicDetailPage = async (req, res) => {
  try {
    const { id } = req.params;
    const [topic, subtopics] = await Promise.all([
      topicModel.getTopicById(id),
      subtopicModel.getSubtopicsForTopic(id)
    ]);

    if (topic) {
      res.render('topic-detail', { topic, subtopics });
    } else {
      res.status(404).send('Tema no encontrado');
    }
  } catch (error) {
    res.status(500).send("Error al cargar la página de detalle.");
  }
};

