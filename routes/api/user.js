const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//@route  api/user
//@desc user router redister user
//@access public - not token required
router.post('/', [
    check('name', 'Name is required.').not().isEmpty(),
    check('email', 'Please provide valid email.').isEmail(),
    check('password', 'Please provide min 6 characters.').isLength({min: 6})
],async (req, res) => {
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

        }catch(err){
            console.log(error.message);
            return res.status(500).send('server error');
        }
        
        res.send('User route');

    }else{
        res.status(400).json({errors: errors.array()});
    }
   
});

module.exports = router;