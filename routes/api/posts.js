const express = require('express');
const router = express.Router();

//@route GET api/post
//@desc test router
//@access public - not token required
router.get('/', (req, res) => res.send('User postts'));

module.exports = router;