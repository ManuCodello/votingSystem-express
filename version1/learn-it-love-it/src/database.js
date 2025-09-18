const sqlite3 = require('sqlite3').verbose();

// Abre (o crea si no existe) el archivo de la base de datos
const db = new sqlite3.Database('./learnit.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Successfully connected to the SQLite database.');
        // Activar claves foráneas para integridad referencial
        db.run('PRAGMA foreign_keys = ON;', (err) => {
            if (err) {
                console.error("Could not enable foreign keys", err.message);
            }
        });
        // Llama a la función para crear las tablas
        createTables();
    }
});

// Función para crear las tablas y sembrar datos iniciales
const createTables = () => {
    // Usamos db.serialize para ejecutar comandos secuencialmente
    db.serialize(() => {
        // Crear la tabla de Topics
        db.run(`
            CREATE TABLE IF NOT EXISTS topics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                votes INTEGER DEFAULT 0
            )
        `);

        // Crear la tabla de Links
        // La clave foránea 'topic_id' se eliminará en cascada si se borra el tema
        db.run(`
            CREATE TABLE IF NOT EXISTS links (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                url TEXT NOT NULL,
                votes INTEGER DEFAULT 0,
                topic_id INTEGER,
                FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
            )
        `);
        
        console.log('Tables are ready.');

        // Sembrar datos iniciales solo si la tabla de temas está vacía
        db.get("SELECT COUNT(*) as count FROM topics", (err, row) => {
            if (row && row.count === 0) {
                console.log('Seeding initial data...');
                const seedTopics = [
                    { title: "Dominar el arte de preparar café ☕️", votes: 15, links: [
                        { title: "Guía de Aeropress", url: "https://aeropress.com/pages/how-it-works", votes: 8 },
                        { title: "Técnica V60", url: "https://www.hario.jp/v60_series.html", votes: 5 },
                    ]},
                    { title: "Cómo programar como un ninja 🥷", votes: 8, links: [
                        { title: "Principios SOLID", url: "https://en.wikipedia.org/wiki/SOLID", votes: 12 },
                    ]}
                ];

                const insertTopic = db.prepare("INSERT INTO topics (title, votes) VALUES (?, ?)");
                const insertLink = db.prepare("INSERT INTO links (title, url, votes, topic_id) VALUES (?, ?, ?, ?)");

                seedTopics.forEach(topic => {
                    insertTopic.run(topic.title, topic.votes, function(err) {
                        if (err) return console.error(err.message);
                        const topicId = this.lastID; // Obtener el ID del tema recién insertado
                        topic.links.forEach(link => {
                            insertLink.run(link.title, link.url, link.votes, topicId);
                        });
                    });
                });

                insertTopic.finalize();
                insertLink.finalize();
                console.log('Initial data seeded.');
            }
        });
    });
};

// Exportamos la instancia de la base de datos para usarla en el modelo
module.exports = db;