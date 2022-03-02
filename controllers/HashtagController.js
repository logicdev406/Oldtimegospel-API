const response = require('../helper/response');
const Hashtag = require('../models/Hashtag');

class HashtagController {
  // List hashtag
  static async listHashtags(req, res) {
    try {
      const hashtags = await Hashtag.findAll();

      if (!hashtags) {
        return res
          .status(500)
          .send(response('Faild to fetch hashtags', {}, false));
      }

      res.send(response('Fetch hashtags successfully', hashtags));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Fetch hashtag by slug
  static async fetchHashtagBySlug(req, res) {
    try {
      const slug = req.params.slug;

      const hashtags = await Hashtag.findOne({
        where: {
          slug: slug
        }
      });

      if (!hashtags) {
        return res
          .status(500)
          .send(response('Faild to fetch hashtags', {}, false));
      }

      res.send(response('Fetched hashtags successfully', hashtags));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Create hashtag
  static async createHashtag(req, res) {
    try {
      const { title } = req.body;

      // Check if a hashtag with the given id exists
      const hashtagExists = await Hashtag.findOne({
        where: {
          title: title
        }
      });

      if (hashtagExists)
        return res
          .status(500)
          .send(
            response(' Hashtag with the given title already exists', {}, false)
          );

      const hashtag = await Hashtag.create({
        title: title
      });

      if (!hashtag)
        return res
          .status(500)
          .send(response('Hashtag can not be created', {}, false));

      res.send(response('Hashtag was created successfully', hashtag));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Update hashtag by id
  static async updateHashtagById(req, res) {
    try {
      const { title } = req.body;
      const id = req.params.id;

      // Check if the given id is valide
      const hashtagExists = await Hashtag.findOne({
        where: {
          id: id
        }
      });

      if (!hashtagExists)
        return res
          .status(500)
          .send(
            response(' Hashtag with the given ID does not exists', {}, false)
          );

      // Check if the given id is valide
      const titleExists = await Hashtag.findOne({
        where: {
          title: title
        }
      });

      if (titleExists)
        return res
          .status(500)
          .send(
            response(' Hashtag with the given title already exists', {}, false)
          );

      const hashtag = await Hashtag.update(
        {
          title: title
        },
        { where: { id: id }, individualHooks: true }
      );

      if (!hashtag)
        return res
          .status(500)
          .send(response('The hashtag can not be updated', {}, false));

      return res.send(response('Hashtag was successfullly updated', hashtag));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Delete hashtag by id
  static async deleteHashtagById(req, res) {
    try {
      const id = req.params.id;

      // Check if the given id is valide
      const hashtagExists = await Hashtag.findOne({
        where: {
          id: id
        }
      });

      if (!hashtagExists)
        return res
          .status(500)
          .send(
            response(' Hashtag with the given ID does not exists', {}, false)
          );

      const hashtag = await Hashtag.destroy({
        where: {
          id: id
        }
      });

      if (!hashtag) {
        return res
          .status(500)
          .send(response('Hashtag with the given does not exists', {}, false));
      }

      res.send(response(' Hashtag deleted successfully', {}));
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = HashtagController;
