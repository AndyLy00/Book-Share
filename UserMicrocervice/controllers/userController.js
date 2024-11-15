import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../models/User.js";
import axios from "axios";
import CircuitBreaker from 'opossum';

const circuitBreakerOptions = {
    timeout: 5000, // Timeout for requests in ms
    errorThresholdPercentage: 50, // Percentage of failed requests to trigger the breaker
    resetTimeout: 10000 // Time in ms before trying again after the breaker trips
};

const checkAvailabilityBreaker = new CircuitBreaker(async (rentId, token) => {
    return await axios.post(`http://book-microservice:3000/books/checkAvailability/${rentId}`, {}, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
}, circuitBreakerOptions);

const changeStatusBreaker = new CircuitBreaker(async (rentId, token) => {
    return await axios.post(`http://book-microservice:3000/books/changeStatus/${rentId}`, {}, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
}, circuitBreakerOptions);

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
    const rentId = req.params.id;
    const token = req.headers['authorization'];
    let isPrepared = false;

    try {
        // Prepare Phase - Step 1: Check Availability
        const response = await checkAvailabilityBreaker.fire(rentId, token);
        if (response.status !== 200) {
            return res.status(response.status).json({
                message: response.data.message || 'This book is not available',
            });
        }

        // Prepare Phase - Step 2: Prepare User Update
        const userUpdate = await UserModel.findByIdAndUpdate(
            req.userId,
            { $addToSet: { booksRented: rentId } },
            { new: false } // Ensures no immediate commit
        );

        if (!userUpdate) {
            throw new Error('Failed to prepare user update');
        }

        // Prepare Phase - Step 3: Prepare Book Status Change
        const bookStatusChange = await changeStatusBreaker.fire(rentId, token);
        if (bookStatusChange.status !== 200) {
            throw new Error('Failed to prepare book status change');
        }

        isPrepared = true; // All participants are prepared

        // Commit Phase - Commit Changes
        await UserModel.findByIdAndUpdate(
            req.userId,
            { $addToSet: { booksRented: rentId } },
            { new: true }
        );

        const commitStatus = await changeStatusBreaker.fire(rentId, token);
        if (commitStatus.status !== 200) {
            throw new Error('Failed to commit book status change');
        }

        return res.json({
            message: 'Book is rented',
        });

    } catch (err) {
        if (isPrepared) {
            // Rollback Phase - Revert Partial Changes
            await UserModel.findByIdAndUpdate(
                req.userId,
                { $pull: { booksRented: rentId } }, // Remove the book from user's rented list
                { new: true }
            );

            await changeStatusBreaker.fire(rentId, token, 'rollback'); // Assume rollback is handled in your `changeStatusBreaker`
        }

        if (err.response) {
            return res.status(err.response.status).json({
                message: err.response.data.message || 'An error occurred during the transaction',
            });
        } else {
            console.error(err);
            return res.status(500).json({
                message: 'Something went wrong while renting the book',
            });
        }
    }
};

// export const rent = async (req, res) => {
//     try {
//         const rentId = req.params.id;
//         const token = req.headers['authorization'];
//         let isPrepared = false;
//         const response = await checkAvailabilityBreaker.fire(rentId, token);
//
//         if (response.status === 200) {
//             await UserModel.findByIdAndUpdate(
//                 req.userId,
//                 { $addToSet: { booksRented: rentId } },
//                 { new: true }
//             );
//
//             const bookRent = await changeStatusBreaker.fire(rentId, token);
//
//             if (bookRent.status === 200) {
//                 return res.json({
//                     message: "Book is rented"
//                 });
//             } else {
//                 return res.status(bookRent.status).json({
//                     message: 'This book is available, but something went wrong while changing the status'
//                 });
//             }
//         } else {
//             return res.status(response.status).json({
//                 message: response.data.message || 'This book is not available'
//             });
//         }
//
//     } catch (err) {
//         if (err.response) {
//             return res.status(err.response.status).json({
//                 message: err.response.data.message || 'An error occurred while checking the book availability'
//             });
//         } else {
//             console.error(err);
//             return res.status(500).json({
//                 message: 'Something went wrong while renting the book'
//             });
//         }
//     }
// };

