const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../database/mysql');

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT id_usuario AS id, nickname FROM usuario');
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Database query failed');
    }
});

module.exports = router;