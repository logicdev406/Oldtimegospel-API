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

      // BucketName
      const bucketname = s3Bucket.s3BucketName;

      // Image upload function
      const imageUrl = await uploadImage(imageFileName, bucketname, imageFile);

      // Extracting the tracks filename and buffer from the req.files and uploading them
      const tracksUrl = await Promise.all(
        tracks.map((audio) => {
          return uploadAudio(audio.originalname, bucketname, audio.buffer);
        })
      );

      // Creating the album
      let album = await Album.create({
        title: title,
        artist: artist,
        trackCount: trackCount,
        description: description,
        image: imageUrl,
        tracks: tracksUrl,
        hashtags: hashtags,
        facebookHandle: facebookHandle,
        instagramHandle: instagramHandle
      });

      res.send(response(' Album created successfully ', album));
    } catch (err) {
      console.log(err);
    }
  }

  static async updateAlbumById(req, res) {
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

      const id = req.params.id;

      // Variables to check if tracks and image exists
      const { tracks, image } = req.files;

      // Check if a music with the given id exists
      const albumExists = await Album.findOne({
        where: {
          id: id
        }
      });

      if (!albumExists)
        return res
          .status(500)
          .send(
            response(' Music with the given ID does not exists', {}, false)
          );

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
      const imageFileName = image ? image[0].originalname : '';
      const imageFile = image ? image[0].buffer : '';

      // BucketName
      const bucketname = s3Bucket.s3BucketName;

      // Image upload function
      const imageUrl = await uploadImage(imageFileName, bucketname, imageFile);

      // Extracting the tracks filename and buffer from the req.files and uploading them
      const tracksUrl = await Promise.all(
        tracks.map((audio) => {
          return uploadAudio(audio.originalname, bucketname, audio.buffer);
        })
      );

      // Updating the album
      let album = await Album.update(
        {
          title: title,
          artist: artist,
          trackCount: trackCount,
          description: description,
          image: imageUrl,
          tracks: tracksUrl,
          hashtags: hashtags,
          facebookHandle: facebookHandle,
          instagramHandle: instagramHandle
        },
        { where: { id: id }, individualHooks: true }
      );

      if (!album)
        return res
          .status(500)
          .send(response('The album can not be updated', {}, false));

      res.send(response(' Album was updated successfully ', album));
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = AlbumController;
