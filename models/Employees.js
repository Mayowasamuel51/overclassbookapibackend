const mongoose = require('mongoose');

const validator = require('validator');
const bcrypt = require('bcryptjs')


const Employees = new mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    address: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
    },
    passwordConfirm: {
        type:String,
        validate: {
            validator: function (el) {
                return el === this.password   // checking if password is equal to passwordConfirm..... 
            },
            message: 'please input a password'
        }
    }
})

/// hashing password below .......................
Employees.pre('save', async function (next) {
    if (  !this.isModified('password')   )      return   next()
    this.password = await bcrypt.hash(this.password, 12)  // set between 9 - 12 
    this.passwordConfirm = undefined;
    next() // means move to the next function 
})


//compare password method below ....................
Employees.methods.checkPassword = async function (password_one, password_two) {
    return bcrypt.compare(password_one, password_two)
}

module.exports = mongoose.model('employess', Employees)