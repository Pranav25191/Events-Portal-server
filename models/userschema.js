const mongoose = require('mongoose')
const userschema= new mongoose.Schema({
    Name:String,
    Mail_Id:String,
    user_profile:String,
    Year:Number,
    Branch:String,
    Myposts:[{
        Post_id:mongoose.Schema.Types.ObjectId,
        Type:String
    }],
    Starred:[{
        Post_id:mongoose.Schema.Types.ObjectId,
        Type:String
    }],
    ReceivedRequests:[{
        Post_id:mongoose.Schema.Types.ObjectId,
        Name:String,
        Description:String,
        RequestedUser_id:mongoose.Schema.Types.ObjectId
    }],
    Myrequests:[{
        Post_id:mongoose.Schema.Types.ObjectId,
        Description:String,
        Status: Boolean
    }]

})
const User = mongoose.model('user',userschema);

module.exports = User;