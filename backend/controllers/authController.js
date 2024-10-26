const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const SECRET_KEY = process.env.SECRET_KEY;


// Register a new user
exports.register = async (req, res) => {
    try {
        const {username, password, firstName, email, lastName, location, role, isActive} = req.body;
        if (!username || !password || !firstName || !lastName || !location || !role || !email) {
            return res.send({
                message: 'all fields are required',
            })
        }
        const hashedPassword = await bcrypt.hash(password, 14);

        const user = new userModel({username, password: hashedPassword, firstName, email, lastName, location, role, isActive});
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
            console.log('wrong credentials');
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

exports.getUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        if(!users) {
            return res.send({
                message: 'Users not found',
            })
        }
            return res.send({
                userCount: users.length,
                users,
            })

    } catch (error) {
        console.error(error)
        return res.send({
            message: 'Oops, something went wrong fetching the users',
            error: error,
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const {id} = req.params
        const user = await userModel.findById(id)
        if(!user) {
            return res.send({
                message: 'User not found',
            })
        } else {
            return res.send({
                user,
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            error: error,
            message: 'Oops, something went wrong fetching the user',
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if(!user) {
            return res.send({
                message: 'User not found',
            })
        } else {
            return res.send({
                message: 'User deleted successfully',
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            error: error,
            message: 'Oops, something went wrong fetching the user',
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await userModel.findByIdAndUpdate(id);
        if(!user) {
            return res.send({
                message: 'User not found',
            })
        } else {
            return res.send({
                message: 'User deleted successfully',
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            error: error,
            message: 'Oops, something went wrong fetching the user',
        })
    }
}

exports.toggleUserStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const {isActive} = req.body;
        const user = await userModel.findByIdAndUpdate(id, isActive, { new: true });
        if(!user) {
            return res.send({
                error: 'User not found',
            })
        } else {
            return res.send({
                message: 'User status updated successfully',
                user,
            })
        }
    }  catch (error) {

    }
}



