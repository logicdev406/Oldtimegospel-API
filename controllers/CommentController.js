const response = require('../helper/response');
const Comment = require('../models/Comment');
const Music = require('../models/Music');

class CommentController {
  // Create comment
  static async createComment(req, res) {
    try {
      const { text, name } = req.body;
      const id = req.params.id;

      // Check if the given id is valide
      const postExists = await Music.findOne({
        where: {
          id: id
        }
      });

      if (!postExists)
        return res
          .status(500)
          .send(
            response(' Music with the given id does not exists', {}, false)
          );

      const comment = await Comment.create({
        text: text,
        name: name,
        postId: id
      });

      if (!comment)
        return res
          .status(500)
          .send(response('The comment can not be created', {}, false));

      res.send(response('Comment was created successfully', comment));
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = CommentController;
