// models/topic.model.js
import { connectToDatabase } from '../database/database.js';

export async function getTopics() {
  const db = await connectToDatabase();
  try {
    return await db.all('SELECT * FROM topics ORDER BY votes DESC');
  } finally {
    await db.close();
  }
}

export async function addTopic(title) {
  const db = await connectToDatabase();
  try {
    await db.run('INSERT INTO topics (title) VALUES (?)', title);
  } finally {
    await db.close();
  }
}

export async function removeTopic(id) {
  const db = await connectToDatabase();
  try {
    await db.run('DELETE FROM topics WHERE id = ?', id);
  } finally {
    await db.close();
  }
}

export async function getTopicById(id) {
  const db = await connectToDatabase();
  try {
    return await db.get('SELECT * FROM topics WHERE id = ?', id);
  } finally {
    await db.close();
  }
}

// Función para votar por un tema principal
export async function incrementVote(id) {
  const db = await connectToDatabase();
  try {
    await db.run('UPDATE topics SET votes = votes + 1 WHERE id = ?', id);
  } finally {
    await db.close();
  }
}