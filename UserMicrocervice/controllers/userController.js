import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import axios from "axios";

// All the functions for Users

export const register = async (req, res) => {
    try {

        const password = req.body.password;
        // Using Salt method for generating a special string
        const salt = await bcrypt.genSalt(10);
        // Hash the password using salt string
        const hash = await bcrypt.hash(password, salt);

        // Creating a new object of type User (document)
        const doc = new UserModel({
            email: req.body.email, nickname: req.body.nickname, passwordHash: hash,
        })

        // Saving it to the database
        const user = await doc.save();

        // Create new token for specific user, using secret key and expiration limit
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'mysecretkey',
            {
                expiresIn: '30d',
            }
        );

        // Removing passwordHash from the response
        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong",
        });
    }

}

export const login = async (req, res) => {
    try {
        // Using Mongo DB method findOne
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return req.status(404).json({
                message: "Such an user does not exist",
            })
        }

        // Compare database password with input password
        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPassword) {
            return req.status(404).json({
                message: "Something went wrong, please check your email and password"
            })
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'mysecretkey',
            {
                expiresIn: '30d',
            }
        )

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        })


    } catch (err) {
        console.log(err);
        return req.status(500).json({
            message: "Something went wrong",
        });
    }

}

export const getMe = async (req, res) => {
    try{
        // Using Mongo DB method findById
        const user = await UserModel.findById(req.userId)
        if(!user) {
            return res.status(404).json({
                message: 'Such an user does not exist'
            });
        }
        const { passwordHash, ...userData } = user._doc;

        res.json(userData);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Authorization failed'
        });
    }
}

export const rent = async (req, res) => {
    try {
        const rentId = req.params.id;
        const token = req.headers['authorization'];

        const response = await axios.post(`http://localhost:3000/books/checkAvailability/${rentId}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });


        if (response.status === 200) {
            await UserModel.findByIdAndUpdate(
                req.userId,
                { $addToSet: { booksRented: rentId } },
                { new: true }
            );

            const bookRent = await axios.post(`http://localhost:3000/books/changeStatus/${rentId}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            if (bookRent.status === 200) {
                return res.json({
                    message: "Book is rented"
                });
            } else {
                return res.status(bookRent.status).json({
                    message: 'This book is available, but something went wrong while changing the status'
                });
            }
        } else {
            return res.status(response.status).json({
                message: response.data.message || 'This book is not available'
            });
        }

    } catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({
                message: err.response.data.message || 'An error occurred while checking the book availability'
            });
        } else {
            console.error(err);
            return res.status(500).json({
                message: 'Something went wrong while renting the book'
            });
        }
    }
};
