import BookModel from "../models/Book.js"
import redis from "redis";


// const redisClient = redis.createClient({
//     socket: {
//         host: 'redis',
//         port: 6379,
//     },
// });
// redisClient.connect()
//     .then(() => console.log("Connected to Redis"))
//     .catch(console.error);

export const create = async (req, res) => {
    try {
        const doc = new BookModel({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            owner: req.body.owner,
            state: req.body.state,
            category: req.body.category,
        });
        const book = await doc.save();
        res.json(book);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error: Book was not created'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const books = await BookModel.find().exec();
        res.json(books);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error: Something went wrong'
        })
    }
}

export const getTags = async (req, res) => {
    try {
        const books = await BookModel.find().limit(5).exec();
        const tags = books.map(obj => obj.tags).flat().slice()
        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error: Something went wrong'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const bookId = req.params.id;

        // const cachedBook = await redisClient.get(`book:${bookId}`);
        // if (cachedBook) {
        //     console.log("book from redis");
        //
        //     return res.json(JSON.parse(cachedBook));
        // }

        const doc = await BookModel.findOneAndUpdate(
            {
                _id: bookId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: "after",
            }
        );

        if (!doc) {
            return res.status(404).json({
                message: "Book was not found",
            });
        }

        // await redisClient.set(`book:${bookId}`, JSON.stringify(doc), { EX: 3600 });

        res.json(doc);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error: Something went wrong'
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await BookModel.findOneAndDelete(
            {
                _id: postId,
            }
        )
        if (!doc) {
            return res.status(404).json({
                message: "Book was not found",
            });
        }
        res.json({
            success: true,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error: Something went wrong'
        });
    }
}

export const update = async (req, res) => {
    try {
        const bookId = req.params.id;
        const doc = await BookModel.updateOne(
            {
                _id: bookId,
            }, {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
        }
        )
        if (!doc) {
            return res.status(404).json({
                message: "Book was not found",
            });
        }
        res.json({
            success: true,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error: Something went wrong'
        });
    }
}

export const checkAvailability = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await BookModel.findById(bookId)
        if (!book) {
            return res.status(404).json({
                message: "Book was not found",
            });
        }
        if (book.state === "available") {
            res.status(200).json({
                message: 'Book is available',
            });
        } else {
            res.status(500).json({
                message: 'Book is not available',
            });
        }

    } catch (err) {
        console.log(err);
        console.log("book error");
        res.status(500).json({
            message: 'Error: Something went wrong',
        });
    }
}

export const changeStatus = async (req, res) => {
    try {
        const bookId = req.params.id;
        const doc = await BookModel.updateOne(
            {
                _id: bookId,
            }, {
                state: "not available",
            }
        )
        if (!doc) {
            return res.status(404).json({
                message: "Status not changed",
            });
        }
        res.json({
            success: true,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error: Something went wrong'
        });
    }
}
