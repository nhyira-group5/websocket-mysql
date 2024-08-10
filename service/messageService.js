const mysql = require('mysql2/promise');
const { poolPromise } = require('../database/mysql'); 

module.exports.registerMessage = async (message) => {
    try {
        const pool = await poolPromise;
        const [result] = await pool.execute(
            `
            INSERT INTO mensagem (chat_id, remetente_id, destinatario_id, assunto, data_hora) 
            VALUES (?, ?, ?, ?, NOW())
            `,
            [message.chatId, message.remetenteId, message.destinatarioId, message.assunto]
        );

        return result; 
    } catch (err) {
        console.error('Erro SQL', err);
        throw new Error('Falha na consulta ao banco de dados');
    }
};

module.exports.findByChatIdPageable = async (chatId, page, elements) => {
    try {
        const offset = (Number(page) - 1) * Number(elements);
        const limit = Number(elements);
        const pool = await poolPromise;

        const [pageResults] = await pool.execute(
            `
            SELECT * FROM mensagem 
            WHERE chat_id = ? 
            ORDER BY data_hora DESC
            LIMIT ? OFFSET ?
            `,
            [chatId, limit, offset]
        );

        const [[totalCountResult]] = await pool.execute(
            `SELECT COUNT(*) as total FROM mensagem WHERE chat_id = ?`,
            [chatId]
        );

        const totalCount = totalCountResult.total;

        return { page: pageResults, total: totalCount };
    } catch (err) {
        console.error('Erro SQL', err);
        throw new Error('Falha na consulta ao banco de dados');
    }
};

module.exports.findByChat = async (chatId) => {
    try {
        const pool = await poolPromise;
        const [messages] = await pool.execute(
            `SELECT * FROM mensagem WHERE chat_id = ?`,
            [chatId]
        );
        return messages;
    } catch (e) {
        console.error('Erro SQL', e);
        throw new Error('Falha na consulta ao banco de dados');
    }
};

module.exports.findChatByUsuario = async (usuario) => {
    try {
        const pool = await poolPromise;
        const [chatEncontrado] = await pool.execute(
            `SELECT * FROM Chat WHERE usuario_id = ? OR personal_id = ?`,
            [usuario, usuario]
        );
        console.log('Chat Encontrado:', chatEncontrado);
        return chatEncontrado;
    } catch (e) {
        console.error('Erro SQL', e);
        throw new Error('Falha na consulta ao banco de dados');
    }
};