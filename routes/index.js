const express = require('express');
const router = express.Router();
const controller = require('../controller/messageController');

router.get('/chat/:chatId', (req, res) => {
    return controller.findByChat(req, res);
});

router.get('/usuario/:idUsuario', (req,res) => {
    return controller.findChatByUsuario(req,res);
})

module.exports = router;