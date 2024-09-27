import mongoose from "mongoose";

// Database Object structure
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    owner: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    category: {
        type: Array,
        default: [],
    },
}, {
    timestamps: true,
});

export default mongoose.model('Book', BookSchema);
