import { connectToDatabase } from './database.js';

async function setup() {
  const db = await connectToDatabase();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      link TEXT,
      votes INTEGER DEFAULT 0
    )
  `);

  const topicCount = await db.get('SELECT COUNT(*) as count FROM topics');
  if (topicCount.count === 0) {
    await db.run('INSERT INTO topics (title, votes) VALUES (?, ?)', 'Cómo programar como un ninja 🥷', 27);
    await db.run('INSERT INTO topics (title, votes) VALUES (?, ?)', 'Dominar el arte de preparar café ☕️', 15);
    await db.run('INSERT INTO topics (title, votes) VALUES (?, ?)', 'Introducción a la física cuántica ⚛️', 42);
    console.log('🌱 Datos iniciales insertados en la base de datos.');
  }
  
  console.log('✅ Base de datos configurada correctamente.');
  await db.close();
}

setup();
