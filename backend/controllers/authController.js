const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;


// Register a new user
exports.register = async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 14);

        const user = new userModel({username, password: hashedPassword});
        await user.save();
        return res.send({
            message: 'User registered successfully',
        })
    } catch (error) {
        return res.send({
            error: 'oops, something went wrong during registration',
        })
    }
};

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.send({
                message: 'Username and password are required',
            })
        }

        const user = await userModel.findOne({ username })
        if (!user) {
            return res.send({
                message: 'username isn\'t found',
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('hello anybody there');
            return res.send({
                error: 'Invalid username or password',

            })
        } else {
            const token = jwt.sign({userId: user._id}, SECRET_KEY, {expiresIn: 3600});
            res.json({token})
        }



    } catch (error) {
        return res.send({
            error: 'oops, something went wrong during registration',
        })

    }
}