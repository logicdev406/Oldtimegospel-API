const response = require('../helper/response');

class PostsController {
  static async listPosts(req, res) {
    res.send('This is the list of products routes');
  }
}

module.exports = PostsController;
