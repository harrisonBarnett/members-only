var express = require('express');
var router = express.Router();
const { ensureAuth, forwardAuth } = require('../config/auth')
const Message = require('../models/Message')

/* GET home page. */
router.get('/', forwardAuth, async (req, res, next) => {
  const messages = await Message.find({}).sort('-date_modified')
  res.render('index', {messages: messages});
});

router.get('/dashboard', ensureAuth, async (req, res) => {
  const messages = await Message.find({}).sort('-date_modified')
  res.render('dashboard', {user: req.user, messages: messages})
})

router.post('/', (req, res) => {
  const { title, content } = req.body
  const newMessage = new Message({
    author: req.user.username,
    title,
    content,
    date_modified: Date.now()
  })
  newMessage.save()
    .then(()=> {
      res.redirect('/dashboard')
    })
    .catch(err => console.error(err))
})

router.delete('/:id', (req, res) => {
  Message.deleteOne({_id: req.params.id}).remove()
    .then(()=> {
      res.redirect('/dashboard')
    })
    .catch(err => console.error(err))
})
module.exports = router;
