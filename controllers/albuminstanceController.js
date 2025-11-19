const AlbumInstance = require('../models/albuminstance');
const Album = require('../models/album');
const { body, validationResult } = require('express-validator');

const async = require('async');

exports.albuminstance_list = async function (req, res, next) {
  try {
    const instances = await AlbumInstance.find().populate('album').exec();
    res.render('albuminstance_list', { title: 'Album Instance List', albuminstance_list: instances });
  } catch (err) {
    return next(err);
  }
};

exports.albuminstance_detail = async function (req, res, next) {
  try {
    const instance = await AlbumInstance.findById(req.params.id).populate('album').exec();
    if (instance == null) {
      const err = new Error('Album copy not found');
      err.status = 404;
      return next(err);
    }
    res.render('albuminstance_detail', { title: `Copy: ${instance.album.title}`, albuminstance: instance });
  } catch (err) {
    return next(err);
  }
};

exports.albuminstance_create_get = async function (req, res, next) {
  try {
    const albums = await Album.find();
    res.render('albuminstance_form', { title: 'Create AlbumInstance', album_list: albums });
  } catch (err) {
    return next(err);
  }
};

exports.albuminstance_create_post = [
  body('album', 'Album must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint required').trim().isLength({ min: 1 }).escape(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('status').trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const albuminstance = new AlbumInstance({
      album: req.body.album,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });
    if (!errors.isEmpty()) {
      try {
        const albums = await Album.find();
        res.render('albuminstance_form', { title: 'Create AlbumInstance', album_list: albums, albuminstance: albuminstance, errors: errors.array() });
      } catch (err) {
        return next(err);
      }
      return;
    } else {
      try {
        await albuminstance.save();
        res.redirect(albuminstance.url);
      } catch (err) {
        return next(err);
      }
    }
  },
];

// Mostrar formulario de eliminación de ejemplar en GET.
exports.albuminstance_delete_get = async function (req, res, next) {
  try {
    const instance = await AlbumInstance.findById(req.params.id).populate('album').exec();
    if (instance == null) {
      res.redirect('/catalog/albuminstances');
      return;
    }
    res.render('albuminstance_delete', { title: 'Delete AlbumInstance', albuminstance: instance });
  } catch (err) {
    return next(err);
  }
};

// Procesar la eliminación de ejemplar en POST.
exports.albuminstance_delete_post = async function (req, res, next) {
  try {
    await AlbumInstance.findByIdAndRemove(req.body.albuminstanceid);
    res.redirect('/catalog/albuminstances');
  } catch (err) {
    return next(err);
  }
};

// Mostrar formulario de actualización de ejemplar en GET.
exports.albuminstance_update_get = async function (req, res, next) {
  try {
    const [instance, albums] = await Promise.all([
      AlbumInstance.findById(req.params.id).exec(),
      Album.find().exec(),
    ]);
    if (instance == null) {
      const err = new Error('Album copy not found');
      err.status = 404;
      return next(err);
    }
    res.render('albuminstance_form', { title: 'Update AlbumInstance', albuminstance: instance, album_list: albums });
  } catch (err) {
    return next(err);
  }
};

// Procesar la actualización de ejemplar en POST.
exports.albuminstance_update_post = [
  body('album', 'Album must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint required').trim().isLength({ min: 1 }).escape(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('status').trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const albuminstance = new AlbumInstance({
      album: req.body.album,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      try {
        const albums = await Album.find();
        res.render('albuminstance_form', { title: 'Update AlbumInstance', album_list: albums, albuminstance: albuminstance, errors: errors.array() });
      } catch (err) {
        return next(err);
      }
      return;
    } else {
      try {
        const theinstance = await AlbumInstance.findByIdAndUpdate(req.params.id, albuminstance, {});
        res.redirect(theinstance.url);
      } catch (err) {
        return next(err);
      }
    }
  },
];
