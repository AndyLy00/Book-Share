import jwt from 'jsonwebtoken';

// Checking if user is authentificated
export default(req, res, next) => {

    // Remove word "Bearer" from jwt token
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if(token) {
        try{
            // Verify if token is valid
            const decoded = jwt.verify(token, 'mysecretkey');

            // Using User ID from token in next Request
            req.userId = decoded._id;
            next();

        } catch(err){
            return res.status(403).json({
                message: 'Authorization failed',
            })
        }

    } else {
        return res.status(403).json({
            message: 'Authorization failed',
        })
    }
}