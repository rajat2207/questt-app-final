const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    phone: {
        country_code: String,
        mobile: String,
        is_verified: Boolean
    },
    device_token:[String],
    tnc: Boolean,
    app_version : String,
    created_at : String,
    updated_at : String,
    deleted_at : String,
    students: [
        {
            id : String,
            name: String,
            email: {
                address: String,
                is_verified: Boolean
            },
            school: String,
            csv_user_id: String
        }
    ],
    teachers:{
        id : String,
        name: String,
        email: {
            address: String,
            is_verified: Boolean
        },
        csv_user_id: String,
        pin : String
    }
})

const User=mongoose.model('User',userSchema);

module.exports = User;