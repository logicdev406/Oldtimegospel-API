const response = require('../helper/response');
const Post = require('../models/Post');

class PostController {
  static async listPosts(req, res) {
    try {
      const [posts, _] = await Post.listPosts();

      res.send(response('Featched posts successfully', posts));
    } catch (e) {
      console.log(e.message);
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
    let { title, description } = req.body;

    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .send(response('an image is required to create a product', {}, false));
    }

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const image = `${basePath}${fileName}`;

    let post = new Post(title, description, image);

    post = await post.save();

    res.send('Created new post');
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
