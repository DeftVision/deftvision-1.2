const express = require('express');
const router = express.Router();

const {register, login, getUsers, deleteUser, getUser, updateUser, toggleUserStatus} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.delete('/delete/:id', deleteUser);
router.patch('/update/:id', updateUser);
router.patch('/toggle-status', toggleUserStatus)

module.exports = router;