// models/subtopic.model.js
import { connectToDatabase } from '../database/database.js';

export async function getSubtopicsForTopic(topicId) {
  const db = await connectToDatabase();
  try {
    return await db.all('SELECT * FROM subtopics WHERE topic_id = ? ORDER BY votes DESC', topicId);
  } finally {
    await db.close();
  }
}

export async function addSubtopic(title, link, topicId) {
  const db = await connectToDatabase();
  try {
    await db.run('INSERT INTO subtopics (title, link, topic_id) VALUES (?, ?, ?)', title, link, topicId);
  } finally {
    await db.close();
  }
}

export async function updateSubtopic(id, title, link) {
  const db = await connectToDatabase();
  try {
    await db.run('UPDATE subtopics SET title = ?, link = ? WHERE id = ?', title, link, id);
  } finally {
    await db.close();
  }
}

export async function deleteSubtopic(id) {
  const db = await connectToDatabase();
  try {
    await db.run('DELETE FROM subtopics WHERE id = ?', id);
  } finally {
    await db.close();
  }
}

export async function upvoteSubtopic(id) {
  const db = await connectToDatabase();
  try {
    await db.run('UPDATE subtopics SET votes = votes + 1 WHERE id = ?', id);
  } finally {
    await db.close();
  }
}

export async function downvoteSubtopic(id) {
  const db = await connectToDatabase();
  try {
    await db.run('UPDATE subtopics SET votes = votes - 1 WHERE id = ?', id);
  } finally {
    await db.close();
  }
}