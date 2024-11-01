import mongoose from "mongoose";

export const database = () => {
    mongoose.connect('mongodb://localhost:27018/BookServiceBooks').then(() => {
        console.log("DB ok");
    }).catch((err) => console.log('DB error', err))
}