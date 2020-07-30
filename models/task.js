const ms = require('ms');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// TODO: Add auto expiration of task document from the Database after 2days
const taskSchema = new Schema({
    goalType: { type: String, default: 'personal_goal', trim: true },
    goalName: { type: String, required: true },
    goalRepeatNo: { type: Number, default: 1 },
    goalPurpose: { type: String, trim: true },
    goalIcon: { type: String, default: 'tasklist_icon', trim: true },
    goalCompleted: { type: Number, default: 0 },
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
taskSchema.index({ createdAt: 1 }, { expireAfterSeconds: ms('2 days') });
module.exports = mongoose.model('task', taskSchema);