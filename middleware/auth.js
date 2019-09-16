const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
    //get the token
    const token = req.header('x-auth-token');

    if(!token){
        res.status(401).json({ msg : 'autherization failed, no token found'});
    }

    //verify
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();

    }catch(err){
        res.status(401).json({ msg: 'token not valid'});
    }

}