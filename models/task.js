const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    goalType: { type: String, default: 'personal_goal', trim: true},
    goalName: { type: String, required: true },
    goalRepeatNo: { type: Number, default: 1},
    goalPurpose: { type: String, trim: true },
    goalIcon: { type: String, default: 'tasklist_icon', trim: true },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('task', taskSchema);