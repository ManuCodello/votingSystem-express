// controllers/subtopic.controller.js

import * as subtopicModel from '../models/subtopic.model.js';

export const createSubtopic = async (req, res) => {
    // Obtenemos el ID del tema de los parámetros de la URL
    const { topic_id } = req.params;
    // Obtenemos el título y el enlace del cuerpo de la solicitud
    const { title, link } = req.body;
    
    // Le pedimos al modelo que añada el nuevo subtema
    await subtopicModel.addSubtopic(title, link, topic_id);

    // Le pedimos al modelo la lista actualizada de subtemas para este tema
    const subtopics = await subtopicModel.getSubtopicsForTopic(topic_id);
    res.json(subtopics);
};

export const upvote = async (req, res) => {
    // Obtenemos el ID del subtema de los parámetros de la URL
    const { id } = req.params;
    // Obtenemos el ID del tema padre del cuerpo de la solicitud (enviado por fetch)
    const { topic_id } = req.body;
    
    // Le pedimos al modelo que incremente el voto
    await subtopicModel.upvoteSubtopic(id);

    // Le pedimos al modelo la lista actualizada
    const subtopics = await subtopicModel.getSubtopicsForTopic(topic_id);
    res.json(subtopics);
};

export const downvote = async (req, res) => {
    // Obtenemos el ID del subtema de los parámetros de la URL
    const { id } = req.params;
    // Obtenemos el ID del tema padre del cuerpo de la solicitud (enviado por fetch)
    const { topic_id } = req.body;

    // Le pedimos al modelo que decremente el voto
    await subtopicModel.downvoteSubtopic(id);

    // Le pedimos al modelo la lista actualizada
    const subtopics = await subtopicModel.getSubtopicsForTopic(topic_id);
    res.json(subtopics);
};