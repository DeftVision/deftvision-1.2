const employeeModel = require('../models/employeeModel');
const announcementModel = require("../models/announcementModel");

exports.newEmployee = async (req, res) => {
    try {
        const { employeeId, name, position, location, isActive } = req.body;
        if(!name || !position || !location || !employeeId) {
            return res.send({
                message: 'all fields are required'
            })
        }

        const employee = await new employeeModel({employeeId, name, position, location, isActive});
            await employee.save();
            return res.send({
                message: 'Employee saved successfully',
                employee,
            })

    } catch (error) {
        console.log(error)
        return res.send({
            message: 'error saving new employee',
            error,
        })
    }
}

exports.updateEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const {employeeId, name, position, locationId, isActive} = req.body
        const employee = await employeeModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!employee) {
            return res.send({
                message: 'Employee not found'
            })
        }
        return res.send({
            employee
        })

    } catch (error) {
        console.log(error)
        return res.send({
            message: 'error updating employee',
            error,
        })
    }
}

exports.deleteEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const employee = employeeModel.findByIdAndDelete(id);
        if(!employee) {
            return res.send({
                message: 'Employee not found',
            })
        }
        return res.send({
            message: 'Employee deleted successfully',
        })

    } catch (error) {
        console.log(error)
        return res.send({
            message: 'error deleting employee',
            error,
        })
    }
}

exports.getEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const employee = await employeeModel.findById(id);
        if(!employee) {
            return res.send({
                message: 'Employee not found',
            })
        }
        return res.send({
            employee,
        })
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'error loading employee',
            error,
        })
    }
}

exports.getEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.find({});
        if(!employees) {
            return res.send({
                message: 'No employees found',
            });
        }
        return res.send({
            employeeCount: employees.length,
            employees,
        })
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'error getting list of employees',
            error,
        })
    }
}

exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const employee = await employeeModel.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!employee) {
            return res.send({
                error: 'employee not found'
            });
        } else {
            return res.send({
                message: 'Employee status updated successfully',
                employee,
            });
        }
    } catch (error) {
        console.log(error);
        return res.send({
            message: 'something went wrong',
            error: error,
        })
    }
}

exports.getEmployeeByLocation = async (req, res) => {
    const { locationId } = req.params;
    try {
        const employees = await EmployeeModel.find({ location: locationId, isActive: true });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees' });
    }
};