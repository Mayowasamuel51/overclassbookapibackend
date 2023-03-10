const Employees = require('../models/Employees');
const jwt = require('jsonwebtoken');
const appError = require('../error/appError')

const sighToken = (id, name) => {
    return jwt.sign( {id:id, firstname:name} , process.env.JWT_KEY,  {expiresIn:process.env.JWT_EXPIRES_IN} )
}
exports.CreateEmployees = async (req,res, next) => {
    try {   
        const newUser = await Employees.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });
        const token = sighToken(newUser._id, newUser.firstname)
        res.status(201).json({
            status: 200,
            message: 'user created',
            data: {
                user:newUser
            },
            token
    })        
    } catch (err) {
        res.status(404).json({
            status: 404,
            message:err.message
        })
    }
}

exports.loginUser = async (req, res, next) => {
    const { firstname, password } = req.body;
    if (!firstname || !password) {
        return next(new appError('this is empty feilds', 404))
    }
    const user = await Employees.findOne({ firstname: firstname }).select('+password')
    if (!user || !await user.checkPassword(password, user.password)) {
        return next(new appError('incorrect firstname or password', 401))
    }
    // if everything is okay send token to the client
    const token = sighToken(user._id);
    res.status(200).json({
        status: 'success',
        token

    })

}