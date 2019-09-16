const express = require('express');
const router = express.Router();

//@route GET api/profile
//@desc test router
//@access public - not token required
router.get('/', (req, res) => res.send('User profile'));

module.exports = router;