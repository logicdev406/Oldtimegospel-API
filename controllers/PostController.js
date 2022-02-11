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

      console.log([post]);

      res.send(response('Featched post successfully', post));
    } catch (e) {
      console.log(e.message);
    }
  }

  static async createPost(req, res) {
    let { title, description } = req.body;

    let post = new Post(title, description);

    post = await post.save();

    console.log(post);

    res.send('Created new post');
  }
}

module.exports = PostController;
