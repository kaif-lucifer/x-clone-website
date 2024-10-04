import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 3600 * 1000, // milliseconds
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict",// CSRF attacks cross-stie request forgery attacks
        secure: process.env.NODE_ENV !== "developement",
    })
}