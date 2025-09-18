// models/subtopic.model.js

import { connectToDatabase } from '../database/database.js';

// Obtiene todos los subtemas para un tema específico
export async function getSubtopicsForTopic(topicId) {
  const db = await connectToDatabase();
  try {
    return await db.all('SELECT * FROM subtopics WHERE topic_id = ? ORDER BY votes DESC', topicId);
  } finally {
    await db.close();
  }
}

// Añade un nuevo subtema a un tema
export async function addSubtopic(title, link, topicId) {
  const db = await connectToDatabase();
  try {
    await db.run('INSERT INTO subtopics (title, link, topic_id) VALUES (?, ?, ?)', title, link, topicId);
  } finally {
    await db.close();
  }
}

// Incrementa el voto de un subtema (votar)
export async function upvoteSubtopic(id) {
  const db = await connectToDatabase();
  try {
    await db.run('UPDATE subtopics SET votes = votes + 1 WHERE id = ?', id);
  } finally {
    await db.close();
  }
}

// Decrementa el voto de un subtema (desvotar)
export async function downvoteSubtopic(id) {
  const db = await connectToDatabase();
  try {
    await db.run('UPDATE subtopics SET votes = votes - 1 WHERE id = ?', id);
  } finally {
    await db.close();
  }
}