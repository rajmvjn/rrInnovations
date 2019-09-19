const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const config = require('config');
const request = require('request');

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

//@route put api/profile/experince
//@desc put one profile
//@access private - token required

router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is empty').not().isEmpty(),
    check('from', 'From is empty').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);
    if(!errors){
        return res.status(400).json({errors : errors.array()});
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {

        const profile = await Profile.findOne({ user: req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }

});

//@route delete api/profile/experince
//@desc delete one experience
//@access private - token required

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id});
        let removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
});










//@route put api/profile/education
//@desc put one profile
//@access private - token required

router.put('/education', [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
    check('degree', 'Degree is empty').not().isEmpty(),
    check('from', 'From is empty').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);
    if(!errors){
        return res.status(400).json({errors : errors.array()});
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {

        const profile = await Profile.findOne({ user: req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }

});

//@route delete api/profile/education
//@desc delete one education
//@access private - token required

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id});
        let removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
});

//@route get api/profile/gitgub:username
//@desc get one education
//@access public - token not required

router.get('/github/:username', (req, res) => {
    try {
       const options = {
           uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
           sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
           method: 'GET',
           headers: { 'user-agent' : 'node.js' }
       };

       request(options, (error, response, body) => {
            if( error ) console.log(error);

            if(response.statusCode !==200){
                res.status(404).json({ msg: 'No github profile found' });
            }

            res.json(JSON.parse(body));

       });

    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
});

module.exports = router;