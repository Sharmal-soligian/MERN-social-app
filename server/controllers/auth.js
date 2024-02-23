import bcryt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        /* SALT CREATION */
        const salt = await bcryt.genSalt();
        /* PASSWORD HASHING */
        const passwordHash = await bcryt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        res.status(201).json({
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        next(error);
    }
};

/* LOGIN */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        /* IF USER NOT EXISTS */
        if (!user) {
            return res.status(404).json({
                message: 'User does not exists'
            });
        }
        const isMatch = await bcryt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid Credentials'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
        /* REMOVE PASSWORD */
        const { password: userPassword, ...userWithoutPassword } = user.toObject();
        
        res.status(200).json({
            token: token,
            message: 'User logged in successfull',
            data: userWithoutPassword
        });
    } catch (error) {
        next(error);
    }
}