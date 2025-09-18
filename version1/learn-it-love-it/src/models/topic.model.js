const db = require('../database'); // Importamos nuestra conexión a la BD

// --- Funciones de Lógica de Datos (Ahora asíncronas) ---

/**
 * Convierte funciones de callback de sqlite a Promesas para usar async/await.
 * @param {Function} fn - La función de la base de datos (db.all, db.run, db.get).
 * @param {...any} args - Los argumentos para la función de la BD.
 * @returns {Promise<any>}
 */
const dbRun = (fn, ...args) => {
    return new Promise((resolve, reject) => {
        fn.call(db, ...args, function(err, result) {
            if (err) {
                return reject(err);
            }
            // Para db.run, this.lastID y this.changes son útiles
            resolve({ result, lastID: this ? this.lastID : null, changes: this ? this.changes : null });
        });
    });
};


/**
 * Obtiene todos los temas y sus enlaces, ordenados por votos.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de temas.
 */
const getAllTopics = async () => {
    // 1. Obtener todos los temas y todos los enlaces en dos consultas separadas
    const { result: topics } = await dbRun(db.all, "SELECT * FROM topics ORDER BY votes DESC");
    const { result: links } = await dbRun(db.all, "SELECT * FROM links ORDER BY votes DESC");

    // 2. Mapear los enlaces a sus temas correspondientes
    const topicMap = new Map();
    topics.forEach(topic => {
        topic.links = []; // Inicializamos el array de enlaces
        topicMap.set(topic.id, topic);
    });

    links.forEach(link => {
        if (topicMap.has(link.topic_id)) {
            topicMap.get(link.topic_id).links.push(link);
        }
    });

    return topics;
};

/**
 * Agrega un nuevo tema.
 * @param {string} title - El título del nuevo tema.
 */
const addTopic = async (title) => {
    const sql = "INSERT INTO topics (title) VALUES (?)";
    await dbRun(db.run, sql, title);
};

/**
 * Elimina un tema por su ID. Gracias a "ON DELETE CASCADE", los enlaces se borrarán automáticamente.
 * @param {number} id - El ID del tema a eliminar.
 */
const deleteTopic = async (id) => {
    const sql = "DELETE FROM topics WHERE id = ?";
    await dbRun(db.run, sql, id);
};

/**
 * Agrega un enlace a un tema específico.
 * @param {number} topicId - El ID del tema.
 * @param {string} title - El título del enlace.
 * @param {string} url - La URL del enlace.
 */
const addLinkToTopic = async (topicId, title, url) => {
    const sql = "INSERT INTO links (topic_id, title, url) VALUES (?, ?, ?)";
    await dbRun(db.run, sql, topicId, title, url);
};

/**
 * Elimina un enlace por su ID.
 * @param {number} linkId - El ID del enlace.
 */
const deleteLink = async (linkId) => {
    const sql = "DELETE FROM links WHERE id = ?";
    await dbRun(db.run, sql, linkId);
};

/**
 * Incrementa el voto de un tema o un enlace.
 * @param {number|null} topicId - El ID del tema.
 * @param {number|null} linkId - El ID del enlace (o null si se vota por el tema).
 * @returns {Promise<number|null>} El nuevo conteo de votos o null si no se encuentra.
 */
const upvote = async (topicId, linkId = null) => {
    let sql, params, getSql;

    if (linkId) {
        sql = "UPDATE links SET votes = votes + 1 WHERE id = ?";
        getSql = "SELECT votes FROM links WHERE id = ?";
        params = [linkId];
    } else {
        sql = "UPDATE topics SET votes = votes + 1 WHERE id = ?";
        getSql = "SELECT votes FROM topics WHERE id = ?";
        params = [topicId];
    }

    const { changes } = await dbRun(db.run, sql, ...params);
    if (changes > 0) {
        const { result: row } = await dbRun(db.get, getSql, ...params);
        return row ? row.votes : null;
    }
    return null;
};


// Exportamos todas las funciones para que el controlador pueda usarlas.
module.exports = {
    getAllTopics,
    addTopic,
    deleteTopic,
    addLinkToTopic,
    deleteLink,
    upvote,
};