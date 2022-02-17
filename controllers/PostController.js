const response = require('../helper/response');
const Post = require('../models/Post');
const { uploadAudio, uploadImage } = require('../s3Bucket/uploads');
const { fetchObject } = require('../s3Bucket/retreave');
const { s3Bucket } = require('../config/config');

class PostController {
  static async listPosts(req, res) {
    try {
      const posts = await Post.findAll();

      if (!posts) {
        return res
          .status(404)
          .send(response('Faild to fetch all posts', {}, false));
      }

      res.send(response('Featched posts successfully', posts));
    } catch (e) {
      console.log(e.message);
      res.status(500);
    }
  }

  static async findPostById(req, res) {
    try {
      let id = req.params.id;

      let [post, _] = await Post.findById(id);

      if (!post) {
        return res
          .status(404)
          .send(response('Post with the given id does not exist'), {}, false);
      }

      res.send(response('Featched post successfully', post));
    } catch (e) {
      console.log(e.message);
    }
  }

  static async createPost(req, res) {
    // Collecting the body from the req.body
    const { title, lyrics, description, instagramHandle, facebookHandle } =
      req.body;

    // Variables to check if audio and image exists
    const audio = req.files.audio;
    const image = req.files.image;

    // Making the 5 major fields required
    if (!title || !lyrics || !description || !image || !audio) {
      return res
        .status(428)
        .send(
          response(
            'The following fields are required but one is missing :- Title, Image, Description, lyrics, Audio',
            {},
            false
          )
        );
    }

    // Extracting the image filename and buffer from the req.files
    const imageFileName = req.files.image[0].originalname;
    const imageFile = req.files.image[0].buffer;

    // Extracting the audio filename and buffer from the req.files
    const audioFileName = req.files.audio[0].originalname;
    const audioFile = req.files.audio[0].buffer;

    // BucketName
    const bucketname = s3Bucket.s3BucketName;

    // Check if the audio and image name already exists
    const audioExists = await fetchObject(audioFileName, bucketname);
    const imageExists = await fetchObject(imageFileName, bucketname);

    // Check if an audio with the name from the res.body already exists
    if (audioExists) {
      return res
        .status(409)
        .send(
          response(' Audio with the given name already exists ', {}, false)
        );
    }

    // Check if an image with the name from the res.body already exists
    if (imageExists) {
      return res
        .status(409)
        .send(
          response(' Image with the given name already exists ', {}, false)
        );
    }

    // Image upload function
    const imageUrl = await uploadImage(imageFileName, bucketname, imageFile);
    // Audio upload function
    const audioUrl = await uploadAudio(audioFileName, bucketname, audioFile);

    // Creating the post
    let post = new Post({
      title: title,
      description: description,
      image: imageUrl,
      audio: audioUrl,
      lyrics: lyrics,
      facebookHandle: facebookHandle,
      instagramHandle: instagramHandle
    });

    // Saving the post to db
    post = await post.save();

    res.send(response(' Post created successfully ', post));
  }

  static async deletePostById(req, res) {
    try {
      let id = req.params.id;

      let [post, _] = await Post.deleteById(id);

      if (!post) {
        return res
          .status(404)
          .send(response('Post with the given id does not exist'), {}, false);
      }

      res.send(response('Post was successfully', post));
    } catch (e) {
      console.log(e.message);
    }
  }
}

module.exports = PostController;
