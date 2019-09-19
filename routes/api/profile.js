const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

const { check, validationResult  } = require('express-validator');


//@route GET api/profile/me
//@desc get current user profile
//@access private -  token required
router.get('/me', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',['name', 'avatar']);

        if(!profile){
            return res.status(400).send({msg: 'There is no profile for this user'});
        }

        return res.json(profile);

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//@route post api/profile
//@desc create or update profile
//@access private -  token required

router.post('/', [ auth, [
        check('status', 'status is required').not().isEmpty(),
        check('skills', 'skills required').not().isEmpty()
    ]    
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //build profile object
    const profileFields = {};

    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(company) profileFields.website = website;
    if(company) profileFields.location = location;
    if(company) profileFields.bio = bio;
    if(company) profileFields.status = status;
    if(company) profileFields.githubusername = githubusername;

    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    // build social object
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;    

    try{
        let profile = await Profile.findOne({ user: req.user.id });

        if(profile){
            profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
            return res.json(profile);    
        }

        //create a profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }
});

//@route get api/profile
//@desc get all profiles
//@access private - no token required

router.get('/', async (req, res) => {
    try {
        const profile = await Profile.find().populate('user',['name','avatar']);
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
});

//@route get api/profile
//@desc get one profile
//@access private - no token required

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id}).populate('user',['name','avatar']);
        if(!profile){
            res.status(400).send( {msg: 'Profile not found'} );
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        if(err.kind == 'ObjectId'){
           return res.status(400).send( {msg: 'There is no profile with this id'} );
        }
        res.status(500).send( 'Server Error' );
    }
});

//@route delete api/profile
//@desc delete one profile
//@access private - token required

router.delete('/', auth, async (req, res) => {
    try {       
        await Profile.findOneAndRemove({ user: req.user.id});
        await User.findOneAndRemove({ _id: req.user.id});
        res.json({msg: 'User deleted'});
    } catch (err) {
        console.log(err.message);        
        res.status(500).send( 'Server Error' );
    }
});

module.exports = router;