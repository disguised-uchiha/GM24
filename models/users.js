const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
},
    // {
    //     toJSON: {
    //         virtuals: true,
    //     },
    //     toObject: {
    //         virtuals: true,
    //     },
    //     timestamps: true
    // }
);
// userSchema.virtual('tasks', {
//     ref: 'task',
//     localField: '_id',
//     foreignField: 'user',
//     justOne: false,
// });
module.exports = mongoose.model('user', userSchema);
