import mongoose from "mongoose";

// Database Object structure
const UserSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema);
