const response = require('../helper/response');
const Post = require('../models/Post');

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
    const {
      title,
      lyrics,
      audio,
      description,
      instagramHandle,
      facebookHandle
    } = req.body;

    if (!title || !lyrics || !audio || !description) {
      return res
        .status(428)
        .send(
          response(
            'The following fields are required but one is missing :- Title, Description, lyrics, Audio'
          ),
          {},
          false
        );
    }

    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .send(response('an image is required to create a product', {}, false));
    }

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const image = `${basePath}${fileName}`;

    let post = new Post({
      title: title,
      description: description,
      image: image,
      audio: audio,
      lyrics: lyrics,
      facebookHandle: facebookHandle,
      instagramHandle: instagramHandle
    });

    post = await post.save();

    res.send(response('Post was successfully created', post));
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
