const Album = require('../models/album');
const Artist = require('../models/artist');
const Genre = require('../models/genre');
const AlbumInstance = require('../models/albuminstance');
const { body, validationResult } = require('express-validator');

const async = require('async');

exports.album_list = async function (req, res, next) {
  try {
    const albums = await Album.find({}, 'title artist').populate('artist').exec();
    res.render('album_list', { title: 'Album List', album_list: albums });
  } catch (err) {
    return next(err);
  }
};


exports.album_detail = async function (req, res, next) {
  try {
    const [album, albumInstances] = await Promise.all([
      Album.findById(req.params.id).populate('artist').populate('genre').exec(),
      AlbumInstance.find({ album: req.params.id }).exec(),
    ]);
    if (album == null) {
      const err = new Error('Album not found');
      err.status = 404;
      return next(err);
    }
    res.render('album_detail', { title: album.title, album: album, album_instances: albumInstances });
  } catch (err) {
    return next(err);
  }
};

exports.album_create_get = async function (req, res, next) {
  try {
    const [artists, genres] = await Promise.all([Artist.find(), Genre.find()]);
    res.render('album_form', { title: 'Create Album', artists: artists, genres: genres });
  } catch (err) {
    return next(err);
  }
};

exports.album_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = req.body.genre ? [req.body.genre] : [];
    }
    next();
  },

  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('artist', 'Artist must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('label').trim().escape(),
  body('genre.*').escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const album = new Album({
      title: req.body.title,
      artist: req.body.artist,
      summary: req.body.summary,
      label: req.body.label,
      genre: req.body.genre,
      release_date: req.body.release_date ? req.body.release_date : null,
    });

    if (!errors.isEmpty()) {
      try {
        const [artists, genres] = await Promise.all([Artist.find(), Genre.find()]);
        // Mark selected genres as checked.
        // Marcar los géneros seleccionados como checked.
        for (const genre of genres) {
          if (album.genre.indexOf(genre._id) > -1) {
            genre.checked = 'true';
          }
        }
        res.render('album_form', { title: 'Create Album', artists: artists, genres: genres, album: album, errors: errors.array() });
      } catch (err) {
        return next(err);
      }
      return;
    } else {
      try {
        await album.save();
        res.redirect(album.url);
      } catch (err) {
        return next(err);
      }
    }
  },
];

exports.album_delete_get = async function (req, res, next) {
  try {
    const [album, albumInstances] = await Promise.all([
      Album.findById(req.params.id).exec(),
      AlbumInstance.find({ album: req.params.id }).exec(),
    ]);

    if (album == null) {
      res.redirect('/catalog/albums');
      return;
    }

    res.render('album_delete', { title: 'Delete Album', album: album, album_instances: albumInstances });
  } catch (err) {
    return next(err);
  }
};

exports.album_delete_post = async function (req, res, next) {
  try {
    const [album, albumInstances] = await Promise.all([
      Album.findById(req.body.albumid).exec(),
      AlbumInstance.find({ album: req.body.albumid }).exec(),
    ]);

    if (albumInstances.length > 0) {
      res.render('album_delete', { title: 'Delete Album', album: album, album_instances: albumInstances });
      return;
    } else {
      await Album.findByIdAndRemove(req.body.albumid);
      res.redirect('/catalog/albums');
    }
  } catch (err) {
    return next(err);
  }
};

exports.album_update_get = async function (req, res, next) {
  try {
    const [album, artists, genres] = await Promise.all([
      Album.findById(req.params.id).exec(),
      Artist.find().exec(),
      Genre.find().exec(),
    ]);
    if (album == null) {
      const err = new Error('Album not found');
      err.status = 404;
      return next(err);
    }

    for (const genre of genres) {
      for (const albGenre of album.genre) {
        if (genre._id.toString() === albGenre.toString()) {
          genre.checked = 'true';
        }
      }
    }
    res.render('album_form', { title: 'Update Album', artists: artists, genres: genres, album: album });
  } catch (err) {
    return next(err);
  }
};

exports.album_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = req.body.genre ? [req.body.genre] : [];
    }
    next();
  },

  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('artist', 'Artist must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('label').trim().escape(),
  body('genre.*').escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const album = new Album({
      title: req.body.title,
      artist: req.body.artist,
      summary: req.body.summary,
      label: req.body.label,
      genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
      release_date: req.body.release_date ? req.body.release_date : null,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      try {
        const [artists, genres] = await Promise.all([Artist.find(), Genre.find()]);
        for (const genre of genres) {
          if (album.genre.indexOf(genre._id) > -1) {
            genre.checked = 'true';
          }
        }
        res.render('album_form', { title: 'Update Album', artists: artists, genres: genres, album: album, errors: errors.array() });
      } catch (err) {
        return next(err);
      }
      return;
    } else {
      try {
        const thealbum = await Album.findByIdAndUpdate(req.params.id, album, {});
        res.redirect(thealbum.url);
      } catch (err) {
        return next(err);
      }
    }
  },
];
