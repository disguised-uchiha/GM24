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
    streak: { type: Number, default: 0 },
    medals: { type: Number, default: 0 },
    status: { type: String, default: 'Mortal' },
    resetToken: String,
    resetTokenExpiration: Date,
});

module.exports = mongoose.model('user', userSchema);
