import mongoose from "mongoose";

export const database = () => {
    mongoose.connect('mongodb://bookdb:27017/BookServiceBooks').then(() => {
        console.log("DB ok");
    }).catch((err) => console.log('DB error', err))
}