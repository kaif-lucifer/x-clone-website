import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User Not Found" });

        if (!text && !img) {
            return res.status(400).json({ error: "Post must have text or image" });
        }


        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img,
        })

        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.log("Error in createPost controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}
export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post Not Found" });

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // Unlike the Post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            // Like the Post
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();

            // Send notification to the user
            const newNotification = new Notification({
                type: "like",
                from: userId,
                to: post.user,
            })

            await newNotification.save();

            const updatedLikes = post.likes;
            // TODO: return the id of the user as a response
            res.status(200).json(updatedLikes);
        }

    } catch (error) {
        console.log("Error in likeUnlikePost controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}
export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id.toString();

        if (!text) return res.status(400).json({ error: "Comment shouldn't be empty" });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post Not Found" });

        const comment = { user: userId, text }

        post.comments.push(comment);

        await post.save();

        res.status(200).json(post);

    } catch (error) {
        console.log("Error in commentOnPost controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post Not Found" });

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        if (post.img) {
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post Deleted Successfully" })

    } catch (error) {
        console.log("Error in deletePost controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({ // To see the user Info through posts
            path: "user",
            select: "-password",
        }).populate({ // to see the user Info through comments
            path: "comments.user",
            select: "-password",
        });
        if (posts.length === 0) return res.status(200).json([]);

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPost controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getLikedPosts = async (req, res) => {

    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User Not Found" });

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });

        // if (likedPosts.length === 0) return res.status(200).json([]);

        res.status(200).json(likedPosts);
    } catch (error) {
        console.log("Error in getLikedPosts controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User Not Found" });

        const following = user.following;

        const followingPosts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });

        res.status(200).json(followingPosts);

    } catch (error) {
        console.log("Error in getFollowingPosts controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User Not Found" });

        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(posts);


    } catch (error) {
        console.log("Error in getUserPosts controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
}