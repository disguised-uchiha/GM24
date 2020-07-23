const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    goalType: String,
    goalName: String,
    goalRepeatNo: Number,
    goalPurpose: String,
    goalIcon: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'user',
    //     required: true,
    // }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('task', taskSchema);