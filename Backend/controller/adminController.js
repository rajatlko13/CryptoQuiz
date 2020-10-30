const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

const registerAdmin = async (req,res) => {
    try{
        console.log('in registerAdmin api');
        console.log(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newAdmin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        });
        const admin = await newAdmin.save();
        res.json(admin);
    }catch(err){
        res.status(400).json({
            error: "Email already registered"
        });
    }
} 

const loginAdmin = async (req,res,next) => {
    try {
        console.log('in loginAdmin api');
        const admin = await Admin.find({email: req.body.email});
        if(admin){
            const valid = await bcrypt.compare(req.body.password, admin[0].password);
            if(!valid)
                res.status(401).json({             // 401-unauthorised
                    'error': 'Wrong Password'
                });
            
            const token = jwt.sign({email: admin[0].email, role: "admin"}, 'TOKEN_SECRET');
            res.header("auth-token", token).status(200).json({"token": token});
            next();
        }
    } catch (error) {
        res.status(400).json({                      //400-Bad Request
            'error': 'Invalid Details'
        });
    }
}

module.exports = { registerAdmin, loginAdmin};