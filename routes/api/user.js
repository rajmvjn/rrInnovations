const express = require('express');
const router = express.Router();

//@route GET api/users
//@desc test router
//@access public - not token required
router.get('/', (req, res) => res.send('User route'));

module.exports = router;