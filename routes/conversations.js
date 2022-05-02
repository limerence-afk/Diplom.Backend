const router = require('express').Router();
const Conversation = require('../models/Conversation');

//new conv
router.post('/', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      $or: [
        { members: [req.body.senderId, req.body.receiverId] },
        { members: [req.body.receiverId, req.body.senderId] },
      ],
    });
    if (conversation.length > 0) {
      res.statusCode(400);
      return;
    }
  } catch (err) {
    res.status(400).json(err);
    return;
  }
  try {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get  conv
router.get('/:userId', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/find/:firstUserId/:secondUserId', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
