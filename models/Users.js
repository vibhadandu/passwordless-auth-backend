const mongoose = require("mongoose");
const UserSchema = mongoose.Schema(
    {
        email:{
            type:String,
            trim:true
        },
        id:{
            type:String,
        }

    }
)
module.exports = mongoose.model("User",UserSchema);