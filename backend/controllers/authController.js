const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'a1a2ebd0aa735c8df9a48f8878333f78c73044b3355f2712b4373e23251b9110463349e523164bd71cd1d32feb0686a8ae709629e7bab51c91e3d64d6a7be03a4469774ef3bf6d1020bafaa800c8acbe27bd4625c1eb642618c8f29c4d6c566ca09276693157d545ea33f79fddd992f6b7d8c867b846d8e14a77bb8f63ced64ddc12f920a2cc2b4fecf08ab92583f616eb3bab561fdf3917c1a76125868fc2eb08d91f86aa51182c7efd9e89257d96cb64e2346371bd9c30a92ad8c18a932b3349449871483f84dc8e0731dc9b415c8367d007aa4b81d35e9cda850938f8536799b7c8cb02075fdd93ae15b8032b06baac6d069713acbdf490b26e393decc91e';


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

        const user = await userModel.findOne({username})
        if (!user) {
            return res.send({
                message: 'username isn\'t found',
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send({
                error: 'Invalid username or password',
            })
        } else {
            const token = jwt.sign({userId: user._id}, SECRET_KEY, {expiresIn: 60 * 60 * 1000});
            res.json({token})
            return res.send({
                user,
            })
        }



    } catch (error) {
        return res.send({
            error: 'oops, something went wrong during registration',
        })

    }
}