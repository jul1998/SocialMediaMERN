const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {
    try {
      const { userId, description, picturePath } = req.body;
      console.log(req.body);
  
      const user = await User.findById(userId);
      !user && res.status(404).json("User not found");
  
      const newPost = new Post({
        userId,
        firstName: user.firstname,
        lastName: user.lastName,
        location: user.location,
        description,
        picturePath: picturePath,
        likes: {},
        comments: [],
      });
  
      await newPost.save();
  
      const posts = await Post.find(); // Wait for the posts to be fetched
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  };
  

const getFeedPosts = async (req, res) => {
    try{
        const post = await Post.find();
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
}

const  getUserPosts = async (req, res) => {
    try{
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
}

const likePost = async (req, res) => {

    try{
        const {id} = req.params;
        const {userId} = req.body;

        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(!isLiked){
            post.likes.set(userId, true);
        }
        else{
            post.likes.delete(userId);
        }

        const updatedPost = await post.save();

        res.status(200).json(updatedPost);

    }catch(err){
        res.status(500).json(err);
    }

}


module.exports = {createPost, getFeedPosts, getUserPosts, likePost};