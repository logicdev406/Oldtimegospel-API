const response = require('../helper/response');
const { uploadAudio, uploadImage } = require('../s3Bucket/uploads');
const { fetchObject } = require('../s3Bucket/retreave');
const { deleteFile } = require('../s3Bucket/delete');
const { s3Bucket } = require('../config/config');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Hashtag = require('../models/Hashtag');

class PostController {
  // List posts
  static async listPosts(req, res) {
    try {
      res.send(response('Fetched posts successfully', res.paginatedResults));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Find post by slug
  static async findPostBySlug(req, res) {
    try {
      const slug = req.params.slug;

      const post = await Post.findOne({ where: { slug: slug } });

      if (!post) {
        return res.status(404).send(response('Post not found', {}, false));
      }

      //  Converting the hashtag field with list of strings to array
      post.hashtags = await post.hashtags.split(' ');

      res.send(response('Fetched post successfully', post));
    } catch (err) {
      console.log(err.message);
    }
  }

  static async createPost(req, res) {
    try {
      // Collecting the body from the req.body
      const {
        title,
        lyrics,
        artist,
        description,
        hashtags,
        instagramHandle,
        facebookHandle
      } = req.body;

      // Variables to check if audio and image exists
      const { audio, image } = req.files;

      // Making the 6 major fields required
      if (!title || !artist || !lyrics || !description || !image || !audio) {
        return res
          .status(428)
          .send(
            response(
              'The following fields are required but one is missing :- Title, Image, Description, lyrics, Audio, artist',
              {},
              false
            )
          );
      }

      // Checking if the title already exists
      const titleExists = await Post.findOne({ where: { title: title } });

      // Returning and error message if the title already exists
      if (titleExists) {
        return res
          .status(409)
          .send(
            response('Post with the given title already exists', {}, false)
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
      let post = await Post.create({
        title: title,
        artist: artist,
        description: description,
        image: imageUrl,
        audio: audioUrl,
        lyrics: lyrics,
        hashtags: hashtags,
        facebookHandle: facebookHandle,
        instagramHandle: instagramHandle
      });

      res.send(response(' Post created successfully ', post));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Update post by id
  static async updatePostById(req, res) {
    try {
      const {
        title,
        description,
        lyrics,
        hashtags,
        instagramHandle,
        facebookHandle
      } = req.body;
      const id = req.params.id;
      const files = req.files;

      // Check if a post with the given id exists
      const postExists = await Post.findOne({
        where: {
          id: id
        }
      });

      if (!postExists)
        return res
          .status(500)
          .send(response(' Post with the given ID does not exists', {}, false));

      // Checking if the title already exists
      const titleExists = title
        ? await Post.findOne({ where: { title: title } })
        : '';

      // Returning an error message if the title already exists
      if (titleExists) {
        return res
          .status(409)
          .send(
            response('Post with the given title already exists', {}, false)
          );
      }

      // Extracting the image filename and buffer from the req.files
      const imageFileName = files.image
        ? req.files.image[0].originalname
        : undefined;
      const imageFile = files.image ? req.files.image[0].buffer : undefined;

      // Extracting the audio filename and buffer from the req.files
      const audioFileName = files.audio
        ? req.files.audio[0].originalname
        : undefined;
      const audioFile = files.audio ? req.files.audio[0].buffer : undefined;

      // BucketName
      const bucketname = s3Bucket.s3BucketName;

      // Check if the audio and image name already exists
      const audioExists =
        audioFileName !== undefined
          ? await fetchObject(audioFileName, bucketname)
          : undefined;
      const imageExists =
        imageFileName !== undefined
          ? await fetchObject(imageFileName, bucketname)
          : undefined;

      // Check if an audio with the name from the res.files already exists
      if (audioExists) {
        return res
          .status(409)
          .send(
            response(' Audio with the given name already exists ', {}, false)
          );
      }

      // Check if an image with the name from the res.files already exists
      if (imageExists) {
        return res
          .status(409)
          .send(
            response(' Image with the given name already exists ', {}, false)
          );
      }

      // Image upload function
      const imageUrl = files.image
        ? await uploadImage(imageFileName, bucketname, imageFile)
        : undefined;
      // Audio upload function
      const audioUrl = files.audio
        ? await uploadAudio(audioFileName, bucketname, audioFile)
        : undefined;

      const post = await Post.update(
        {
          title: title,
          audio: audioUrl,
          image: imageUrl,
          description: description,
          lyrics: lyrics,
          hashtags: hashtags,
          facebookHandle: facebookHandle,
          instagramHandle: instagramHandle
        },
        { where: { id: id }, individualHooks: true }
      );

      if (!post)
        return res
          .status(500)
          .send(response('The post can not be updated', {}, false));

      return res.send(response('Post was successfully updated', post));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Fetch all post with the given hashtag/slug
  static async fetchPostByHashtag(req, res) {
    try {
      const slug = req.params.slug;

      const hashtagExists = await Hashtag.findOne({ where: { slug: slug } });

      if (!hashtagExists) {
        return res
          .status(500)
          .send(
            response('Hashtag with the given slug does not exists', {}, false)
          );
      }

      const posts = await Post.findAll({});

      const filteredPosts = posts.filter((post) => {
        post.hashtags = post.hashtags.split(' ');

        return post.hashtags.indexOf(slug) >= 0;
      });

      console.log(filteredPosts);

      if (filteredPosts.length < 1) {
        return res
          .status(500)
          .send(response('Post with the given hashtag not found', {}, false));
      }

      return res.send(response('Featched posts successfully ', filteredPosts));
    } catch (err) {
      console.log(err);
    }
  }

  // Fetch post by slug
  static async featchPostComments(req, res) {
    try {
      const id = req.params.id;

      // Check if post with  the given id exists
      const postExists = await Post.findOne({
        where: {
          id: id
        }
      });

      if (!postExists)
        return res
          .status(500)
          .send(response(' Post with the given id does not exists', {}, false));

      const comments = await Comment.findAll({ where: { postId: id } });

      if (!comments) {
        return res.status(404).send(response('No comments found '), {}, false);
      }

      res.send(response('Fetched comment successfully', comments));
    } catch (err) {
      console.log(err.message);
    }
  }

  // delete post by id
  static async deletePostById(req, res) {
    try {
      const id = req.params.id;

      const postExists = await Post.findOne({ where: { id: id } });

      const audioFileName = await postExists.dataValues.audio.split('/')[3];
      const imageFileName = await postExists.dataValues.image.split('/')[3];

      // BucketName
      const bucketname = s3Bucket.s3BucketName;

      // delete image and audio from s3 bucket
      await deleteFile(audioFileName, bucketname);
      await deleteFile(imageFileName, bucketname);

      const post = await Post.destroy({
        where: {
          id: id
        }
      });

      if (!post) {
        return res.status(404).send(response('Post not found', {}, false));
      }

      res.send(response('Post was successfully delete', post));
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = PostController;
