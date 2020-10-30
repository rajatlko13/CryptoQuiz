const User = require('../models/User');
const bcrypt = require('bcrypt');

const getList = async (req,res) => {
    try{
        console.log('in getList api');
        const userList = await User.find();
        res.json(userList);
    }catch(err){
        res.json(err);
    }
}

const get = async (req,res) => {
    try{
        console.log('in get api');
        const user = await User.findById(req.params.id);
        res.json(user);
    }catch(err){
        res.json(err);
    }
}

const add = async (req,res) => {
    try{
        console.log('in add api');
        console.log(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            password: hashPassword
        });
        const user = await newUser.save();
        res.json(user);
    }catch(err){
        res.status(400).json({
            error: "Email already registered"
        });
    }
} 

const update = async (req,res) => {
    try{
        console.log('in update api');
        const user = {
            name: req.body.name,
            age: req.body.age
        };
        const updatedUser = await User.findByIdAndUpdate(req.body._id, user);
        res.json(updatedUser);
    }catch(err){
        res.json(err);
    }
}

const remove = async (req,res) => {
    try{
        console.log('in delete api');
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.json(deletedUser);
    }catch(err){
        res.json(err);
    }
}

module.exports = { getList, get, add, update, remove};