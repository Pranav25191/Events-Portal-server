const mongoose = require('mongoose')
const userschema= new mongoose.Schema({
        Name:String,
        Mail_Id:String,
        user_profile:String
}
)
const User = mongoose.model('user',userschema);

module.exports = User;