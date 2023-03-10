
// Create this endpoint below

// employees   GET  ---> Returns a full list of the employees working
// employees   POST  ---> Adds a new employee to the system
// employees/:id   GET  --->   GET Returns the data on a specific employee
// employees/:id   PATCH  --->   PUT Updates the data on a specific employee

const express = require('express');
const controller = require('../controllers/authController');
const router = express.Router();


router.post('/employees', controller.CreateEmployees)


router.post('/login', controller.loginUser)





module.exports = router