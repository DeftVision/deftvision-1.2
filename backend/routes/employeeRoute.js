const express = require("express");
const router = express.Router();
const { deleteEmployee, getEmployee, getEmployees, newEmployee, updateEmployee, toggleStatus, getEmployeeByLocation } = require("../controllers/employeeController");

router.post('/new', newEmployee);
router.patch('/update/:id', updateEmployee);
router.delete('/delete/:id', deleteEmployee);
router.get('/employees', getEmployees);
router.get('/employee/:id', getEmployee);
router.patch('/toggle-status/:id', toggleStatus);
router.get('/employee/:locationId', getEmployeeByLocation);

module.exports = router;