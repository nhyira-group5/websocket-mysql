const service = require('../service/messageService');

module.exports.findByChatIdPageable = async (req, res) => {
    try {
        let messagesPage = await service.findByChatIdPageable(req.params.chatId, req.query.page, req.query.elements);
        return res.status(200).send(messagesPage);
    } catch (error) {
        return res.status(500).send({ error: 'An error occurred while fetching messages' });
    }
};

module.exports.findByChat = async (req,res) => {
    try{
        let messages = await service.findByChat(req.params.chatId);

        return res.status(200).send(messages);
    }catch(e) {
        return res.status(500).send({error: e})
    }
}

module.exports.findChatByUsuario = async (req, res) => {
    try{
        let chatRes = await service.findChatByUsuario(req.params.idUsuario);

        return res.status(200).send(chatRes);
    }catch(e) {
        console.log(e);
        return res.status(500).send({error: e});
    }
}