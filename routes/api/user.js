const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

//@route  api/user
//@desc user router redister user
//@access public - not token required
router.post('/', [
    check('name', 'Name is required.').not().isEmpty(),
    check('email', 'Please provide valid email.').isEmail(),
    check('password', 'Please provide min 6 characters.').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){

        const { name, email, password } = req.body;

        try{
            // check the user exists
            let user = await User.findOne({ email });
            if(user){
                return res.status(400).json({ errors: [{ msg : 'User already exists'}]});
            }

            // get the user gravatar
            const avatar = gravatar.url({
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            user = new User({
                name,
                email,
                avatar,
                password
            });

            // Encrypt pwd
            const salt = await bcrypt.genSalt(10);
            user.password =  await bcrypt.hash(password, salt);
            await user.save();

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