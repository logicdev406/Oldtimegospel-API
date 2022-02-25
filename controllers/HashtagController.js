const Hashtag = require('../models/Hashtag');

class HashtagController {
  static async listHashtags(req, res) {
    try {
      const hashtags = Hashtag.findAll();

      if (!hashtags) {
        return res
          .status(500)
          .send(response('Faild to fetch hashtags', {}, false));
      }

      res.send(response('Featch hashtags successfully', hashtags));
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = HashtagController;
