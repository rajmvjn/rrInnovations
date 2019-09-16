const express = require('express');
const router = express.Router();

//@route GET api/auth
//@desc test router
//@access public - not token required
router.get('/', (req, res) => res.send('User auth'));

module.exports = router;