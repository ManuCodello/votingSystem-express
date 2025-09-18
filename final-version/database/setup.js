// database/setup.js
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
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS subtopics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      link TEXT NOT NULL,
      votes INTEGER DEFAULT 0,
      topic_id INTEGER,
      FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
    )
  `);

  const topicCount = await db.get('SELECT COUNT(*) as count FROM topics');
  if (topicCount.count === 0) {
    // Insertamos los TEMAS principales
    await db.run('INSERT INTO topics (title, votes) VALUES (?, ?)', 'Dominar el arte de preparar café ☕️', 15);
    await db.run('INSERT INTO topics (title, votes) VALUES (?, ?)', 'Cómo programar como un ninja 🥷', 27);
    
    // Insertamos SUBTEMAS para el primer tema (ID = 1)
    await db.run('INSERT INTO subtopics (title, link, votes, topic_id) VALUES (?, ?, ?, ?)', 'Guía de granos de café', 'https://es.wikipedia.org/wiki/Grano_de_caf%C3%A9', 10, 1);
    await db.run('INSERT INTO subtopics (title, link, votes, topic_id) VALUES (?, ?, ?, ?)', 'Técnicas de Latte Art', 'https://es.wikipedia.org/wiki/Arte_del_latte', 25, 1);
    
    // Insertamos SUBTEMAS para el segundo tema (ID = 2)
    await db.run('INSERT INTO subtopics (title, link, votes, topic_id) VALUES (?, ?, ?, ?)', 'Entendiendo el Patrón MVC', 'https://developer.mozilla.org/es/docs/Glossary/MVC', 30, 2);

    console.log('🌱 Datos iniciales insertados en la base de datos.');
  }

  console.log('✅ Base de datos configurada correctamente.');
  await db.close();
}

setup();