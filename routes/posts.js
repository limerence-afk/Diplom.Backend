const User = require('../models/User');
const router = require('express').Router();
const Post = require('../models/Post');
const multer = require('multer');
const processFile = require('../middleware/processFile');
const uploadFile = require('../core/uploadFile');
const { reset } = require('nodemon');

//upload file
router.post('/upload', async (req, res) => {
  await processFile(req, res);
  if (!req.file) {
    return res.status(400).send({ message: 'Please upload a file!' });
  }
  try {
    const uploadedFileUrl = await uploadFile('posts', req.file);
    res.status(200).json(uploadedFileUrl);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//create post
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json('the post has been updated');
    } else {
      res.status(403).json('you can update only your post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json('the post has been deleted');
    } else {
      res.status(403).json('you can delete only your post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like post
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json('You liked the post');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json('You disliked the post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts
router.get('/timeline/:userId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({
      userId: { $in: [currentUser._id, ...currentUser.followings] },
    }).sort({ createdAt: -1 });
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
//get user posts
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
