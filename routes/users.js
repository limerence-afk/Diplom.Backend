const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('something users');
});

module.exports = router;
