import { connectToDatabase } from '../database/database.js';

export async function getTopics() {
  const db = await connectToDatabase();
  try {
    const topics = await db.all('SELECT * FROM topics ORDER BY votes DESC');
    return topics;
  } finally {
    await db.close();
  }
}


export async function addTopic(title) {
  const db = await connectToDatabase();
  try {
    // Usamos el marcador de posición (?) para seguridad
    await db.run('INSERT INTO topics (title) VALUES (?)', title);
  } finally {
    await db.close();
  }
}

export async function incrementVote(id) {
  const db = await connectToDatabase();
  try {
    // La sentencia UPDATE modifica una fila existente
    // SET votes = votes + 1 toma el valor actual y le suma 1
    // WHERE id = ? asegura que solo actualicemos la fila correcta
    await db.run('UPDATE topics SET votes = votes + 1 WHERE id = ?', id);
  } finally {
    await db.close();
  }
}


export async function removeTopic(id) {
  const db = await connectToDatabase();
  try {
    // La sentencia DELETE FROM elimina filas de una tabla
    // WHERE id = ? asegura que solo borremos la fila correcta
    await db.run('DELETE FROM topics WHERE id = ?', id);
  } finally {
    await db.close();
  }}
