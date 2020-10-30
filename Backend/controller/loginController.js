const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const authenticate = async (req,res,next) => {
    try {
        console.log('in authenticate api');
        const user = await User.find({email: req.body.email});
        if(user){
            const valid = await bcrypt.compare(req.body.password, user[0].password);
            if(!valid)
                res.status(401).json({             // 401-unauthorised
                    'error': 'Wrong Password'
                });
            
            const token = jwt.sign({email: user[0].email, role: "user"}, 'TOKEN_SECRET');
            res.header("auth-token", token).status(200).json({"token": token});
            next();
        }
    } catch (error) {
        res.status(400).json({                      //400-Bad Request
            'error': 'Invalid Details'
        });
    }
}

module.exports = { authenticate};