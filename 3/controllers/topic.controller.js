import { getTopics, addTopic, incrementVote, removeTopic } from '../models/topic.model.js';

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
  
  // 👇 EN LUGAR DE REDIRIGIR, OBTENEMOS LA LISTA ACTUALIZADA Y LA ENVIAMOS COMO JSON 👇
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
