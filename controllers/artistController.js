const Artist = require('../models/artist');
const { body, validationResult } = require('express-validator');
const Album = require('../models/album');

exports.artist_list = async function (req, res, next) {
  try {
    const artists = await Artist.find().sort([['family_name', 'ascending']]);
    res.render('artist_list', { title: 'Artist List', artist_list: artists });
  } catch (err) {
    return next(err);
  }
};

exports.artist_detail = async function (req, res, next) {
  try {
    const artist = await Artist.findById(req.params.id);
    if (artist == null) {
      const err = new Error('Artist not found');
      err.status = 404;
      return next(err);
    }
    res.render('artist_detail', { title: artist.name, artist: artist });
  } catch (err) {
    return next(err);
  }
};

exports.artist_create_get = function (req, res, next) {
  res.render('artist_form', { title: 'Create Artist' });
};

exports.artist_create_post = [
  body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name required'),
  body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name required'),
  body('date_of_birth', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('date_of_death', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const artist = new Artist({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });
    if (!errors.isEmpty()) {
      res.render('artist_form', { title: 'Create Artist', artist: artist, errors: errors.array() });
      return;
    } else {
      try {
        await artist.save();
        res.redirect(artist.url);
      } catch (err) {
        return next(err);
      }
    }
  },
];

exports.artist_delete_get = async function (req, res, next) {
  try {
    const [artist, artistAlbums] = await Promise.all([
      Artist.findById(req.params.id).exec(),
      Album.find({ artist: req.params.id }).exec(),
    ]);
    if (artist == null) {
      res.redirect('/catalog/artists');
      return;
    }
    res.render('artist_delete', { title: 'Delete Artist', artist: artist, artist_albums: artistAlbums });
  } catch (err) {
    return next(err);
  }
};

exports.artist_delete_post = async function (req, res, next) {
  try {
    const [artist, artistAlbums] = await Promise.all([
      Artist.findById(req.body.artistid).exec(),
      Album.find({ artist: req.body.artistid }).exec(),
    ]);
    if (artistAlbums.length > 0) {
      res.render('artist_delete', { title: 'Delete Artist', artist: artist, artist_albums: artistAlbums });
      return;
    } else {
      await Artist.findByIdAndRemove(req.body.artistid);
      res.redirect('/catalog/artists');
    }
  } catch (err) {
    return next(err);
  }
};

exports.artist_update_get = async function (req, res, next) {
  try {
    const artist = await Artist.findById(req.params.id).exec();
    if (artist == null) {
      const err = new Error('Artist not found');
      err.status = 404;
      return next(err);
    }
    res.render('artist_form', { title: 'Update Artist', artist: artist });
  } catch (err) {
    return next(err);
  }
};

exports.artist_update_post = [
  body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name required'),
  body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name required'),
  body('date_of_birth', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('date_of_death', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const artist = new Artist({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render('artist_form', { title: 'Update Artist', artist: artist, errors: errors.array() });
      return;
    } else {
      try {
        const theartist = await Artist.findByIdAndUpdate(req.params.id, artist, {});
        res.redirect(theartist.url);
      } catch (err) {
        return next(err);
      }
    }
  },
];
