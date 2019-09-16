const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

//@route GET api/auth
//@desc test router
//@access public - not token required
router.get('/', auth ,async (req, res) => {
    try{
        const user =  await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.log(err.message);
        res.status(500).json({msg: 'server error'})
    }
});

//@route  api/auth
//@desc user authentication
//@access public - not token required
router.post('/', [
    check('email', 'Please provide valid email.').isEmail(),
    check('password', 'Password required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){

        const { name, email, password } = req.body;

        try{
            // check the user exists
            let user = await User.findOne({ email });
            if(!user){
                return res.status(400).json({ errors: [{ msg : 'Invalid credentials'}]});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return res.status(400).json({ errors: [{ msg : 'Invalid credentials'}]});
            }

            // return jwt token
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'),{expiresIn:36000}, (err, token) =>{
                if(err) throw err;
                return res.json({token})
            });

        }catch(err){
            console.log(error.message);
            return res.status(500).send('server error');
        }        
      
    }else{
        res.status(400).json({errors: errors.array()});
    }
   
});

module.exports = router;