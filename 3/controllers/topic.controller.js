import { getTopics, addTopic, incrementVote, removeTopic, getTopicById, updateTopic } from '../models/topic.model.js';

export const renderTopicsPage = async (req, res) => {
  try {
    const topics = await getTopics();
    res.render('index', { topics: topics });
  } catch (error) {
    console.error("Error al obtener los temas:", error);
    res.status(500).send("Error al cargar la página de temas.");
  }
};

export const createTopic = async (req, res) => {
  // El middleware que añadimos hace que los datos del form estén en `req.body`
  const { title } = req.body;

  // Una validación simple: si el título no está vacío, lo guardamos
  if (title && title.trim() !== '') {
    await addTopic(title);
  }

  // Redirigimos al usuario a la página principal para que vea la lista actualizada
  res.redirect('/');
};

export const voteForTopic = async (req, res) => {
  const { id } = req.params;
  await incrementVote(id);
  
  //  EN LUGAR DE REDIRIGIR, OBTENEMOS LA LISTA ACTUALIZADA Y LA ENVIAMOS COMO JSON 
  const topics = await getTopics();
  res.json(topics);
};

export const deleteTopic = async (req, res) => {
  const { id } = req.params;
  await removeTopic(id);

  // 👇 HACEMOS LO MISMO AQUÍ 👇
  const topics = await getTopics();
  res.json(topics);
};

// Controlador para obtener un solo tema
export const getSingleTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await getTopicById(id);
    if (topic) {
      res.json(topic);
    } else {
      res.status(404).json({ message: 'Tema no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Controlador para actualizar un tema
export const updateSingleTopic = async (req, res) => {
  const { id } = req.params;
  const { title, link } = req.body; // El middleware urlencoded parsea esto

  await updateTopic(id, title, link);

  // Enviamos la lista actualizada
  const topics = await getTopics();
  res.json(topics);
};