import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId, // 16 characters 123
            ref: "User",
            dafault: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId, // 16 characters 123
            ref: "User",
            dafault: []
        }
    ],

    profileImg: {
        type: String,
        default: "",
    },
    coverImg: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    link: {
        type: String,
        default: "",
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: [],
        }
    ],
},
    { timestamps: true } // createAT and UpdatedAT
);

export const User = mongoose.model("User", userSchema);

// in the DB, this singular User will be converted into users by MongoDB