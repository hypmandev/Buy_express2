const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String, 
        require:true
    },
    email: {
        type: String,
        require:true,
        lowercase:true
    },
    password: {
        type: String,
        require:true
    },
    userName:{
        type: String, 
        require:true
    },
    IsVerified: {
        type: Boolean,
        default: false
    },
    roles: {
        type: String,
        enum: ["admin", "user"],
        default: 'user'
    }
 
},{timestamps: true})

const userModel = mongoose.model('Users', userSchema);

module.exports = userModel;
