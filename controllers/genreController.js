const Genre = require('../models/genre');
const { body, validationResult } = require('express-validator');
const Album = require('../models/album');

exports.genre_list = async function (req, res, next) {
  try {
    const genres = await Genre.find().sort([['name', 'ascending']]);
    res.render('genre_list', { title: 'Genre List', genre_list: genres });
  } catch (err) {
    return next(err);
  }
};

exports.genre_detail = async function (req, res, next) {
  try {
    const genre = await Genre.findById(req.params.id);
    if (genre == null) {
      const err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    res.render('genre_detail', { title: genre.name, genre: genre });
  } catch (err) {
    return next(err);
  }
};

exports.genre_create_get = function (req, res, next) {
  res.render('genre_form', { title: 'Create Genre' });
};

exports.genre_create_post = [
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
      return;
    } else {
      try {
        await genre.save();
        res.redirect(genre.url);
      } catch (err) {
        return next(err);
      }
    }
  },
];

exports.genre_delete_get = async function (req, res, next) {
  try {
    const [genre, genreAlbums] = await Promise.all([
      Genre.findById(req.params.id).exec(),
      Album.find({ genre: req.params.id }).exec(),
    ]);
    if (genre == null) {
      res.redirect('/catalog/genres');
      return;
    }
    res.render('genre_delete', { title: 'Delete Genre', genre: genre, genre_albums: genreAlbums });
  } catch (err) {
    return next(err);
  }
};

exports.genre_delete_post = async function (req, res, next) {
  try {
    const [genre, genreAlbums] = await Promise.all([
      Genre.findById(req.body.genreid).exec(),
      Album.find({ genre: req.body.genreid }).exec(),
    ]);
    if (genreAlbums.length > 0) {
      res.render('genre_delete', { title: 'Delete Genre', genre: genre, genre_albums: genreAlbums });
      return;
    } else {
      await Genre.findByIdAndRemove(req.body.genreid);
      res.redirect('/catalog/genres');
    }
  } catch (err) {
    return next(err);
  }
};

exports.genre_update_get = async function (req, res, next) {
  try {
    const genre = await Genre.findById(req.params.id).exec();
    if (genre == null) {
      const err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    res.render('genre_form', { title: 'Update Genre', genre: genre });
  } catch (err) {
    return next(err);
  }
};

exports.genre_update_post = [
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name, _id: req.params.id });
    if (!errors.isEmpty()) {
      res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array() });
      return;
    } else {
      try {
        const thegenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
        res.redirect(thegenre.url);
      } catch (err) {
        return next(err);
      }
    }
  },
];
