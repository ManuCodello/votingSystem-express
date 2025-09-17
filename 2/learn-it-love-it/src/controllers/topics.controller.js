const model = require('../models/topic.model');

// Renderiza la página principal con todos los temas
const renderTopicsPage = async (req, res) => {
    try {
        const topics = await model.getAllTopics();
        res.render('index', { topics });
    } catch (error) {
        console.error("Error al obtener los temas:", error);
        res.status(500).send("Error al cargar la página.");
    }
};

// --- Controladores de Temas ---

const createTopic = async (req, res) => {
    const { title } = req.body;
    if (title) {
        try {
            await model.addTopic(title);
        } catch (error) {
            console.error("Error al crear el tema:", error);
        }
    }
    res.redirect('/');
};

const deleteTopic = async (req, res) => {
    const topicId = parseInt(req.params.id, 10);
    try {
        await model.deleteTopic(topicId);
    } catch (error) {
        console.error("Error al eliminar el tema:", error);
    }
    res.redirect('/');
};

const upvoteTopic = async (req, res) => {
    const topicId = parseInt(req.params.id, 10);
    try {
        const newVoteCount = await model.upvote(topicId);
        if (newVoteCount !== null) {
            res.json({ success: true, newVoteCount });
        } else {
            res.status(404).json({ success: false, message: 'Topic not found' });
        }
    } catch (error) {
        console.error("Error al votar por el tema:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// --- Controladores de Enlaces ---

const createLink = async (req, res) => {
    const topicId = parseInt(req.params.topicId, 10);
    const { title, url } = req.body;
    if (title && url) {
        try {
            await model.addLinkToTopic(topicId, title, url);
        } catch (error) {
            console.error("Error al crear el enlace:", error);
        }
    }
    res.redirect('/');
};

const deleteLink = async (req, res) => {
    // El topicId no es necesario para eliminar, solo el linkId
    const linkId = parseInt(req.params.linkId, 10);
    try {
        await model.deleteLink(linkId);
    } catch (error) {
        console.error("Error al eliminar el enlace:", error);
    }
    res.redirect('/');
};

const upvoteLink = async (req, res) => {
    const topicId = parseInt(req.params.topicId, 10);
    const linkId = parseInt(req.params.linkId, 10);
    try {
        const newVoteCount = await model.upvote(topicId, linkId);
        if (newVoteCount !== null) {
            res.json({ success: true, newVoteCount });
        } else {
            res.status(404).json({ success: false, message: 'Link not found' });
        }
    } catch (error) {
        console.error("Error al votar por el enlace:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    renderTopicsPage,
    createTopic,
    deleteTopic,
    upvoteTopic,
    createLink,
    deleteLink,
    upvoteLink,
};