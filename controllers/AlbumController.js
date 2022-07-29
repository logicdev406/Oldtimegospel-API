const response = require('../helper/response');
const { uploadAudio, uploadImage } = require('../s3Bucket/uploads');
const { fetchObject } = require('../s3Bucket/retreave');
const { deleteFile } = require('../s3Bucket/delete');
const { s3Bucket } = require('../config/config');
const Album = require('../models/Album');

class AlbumController {
  // List albums
  static async listAlbums(req, res) {
    try {
      res.send(response('Fetched albums successfully', res.paginatedResults));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Find album by slug
  static async findAlbumBySlug(req, res) {
    try {
      const slug = req.params.slug;

      const album = await Album.findOne({ where: { slug: slug } });

      if (!album) {
        return res.status(404).send(response('Album not found', {}, false));
      }

      //  Converting the hashtag field with list of strings to array
      album.hashtags = await album.hashtags.split(' ');

      res.send(response('Fetched album successfully', album));
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = AlbumController;
