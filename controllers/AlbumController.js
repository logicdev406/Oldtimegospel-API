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

  static async createAlbum(req, res) {
    try {
      // Collecting the body from the req.body
      const {
        title,
        artist,
        trackCount,
        description,
        hashtags,
        instagramHandle,
        facebookHandle
      } = req.body;

      // console.log(req.body);

      // Variables to check if tracks and image exists
      const { tracks, image } = req.files;

      // Making the 6 major fields required
      if (
        !title ||
        !artist ||
        !description ||
        !image ||
        !trackCount ||
        !tracks
      ) {
        return res
          .status(428)
          .send(
            response(
              'The following fields are required but one is missing :- Title, Image, Description, Artist, Tracks, TrackCount',
              {},
              false
            )
          );
      }

      // Checking if the title already exists
      const titleExists = await Album.findOne({ where: { title: title } });

      // Returning and error message if the title already exists
      if (titleExists) {
        return res
          .status(409)
          .send(
            response('Album with the given title already exists', {}, false)
          );
      }

      // Extracting the image filename and buffer from the req.files
      const imageFileName = req.files.image[0].originalname;
      const imageFile = req.files.image[0].buffer;

      // Extracting the tracks filename and buffer from the req.files
      const tracksFileName = req.files.tracks.map(
        (track) => track.originalname
      );
      const tracksFile = req.files.tracks.map((track) => track.buffer);
      // console.log(tracksFile);

      // BucketName
      const bucketname = s3Bucket.s3BucketName;

      // Image upload function
      // const imageUrl = await uploadImage(imageFileName, bucketname, imageFile);

      // tracks upload function
      const audioUrl = await uploadAudio(
        tracksFileName,
        bucketname,
        tracksFile
      );
      console.log(audioUrl);

      res.json({ message: 'successfull', data: audioUrl });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = AlbumController;
