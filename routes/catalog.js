var express = require('express');
var router = express.Router();

const catalogController = require('../controllers/catalogController');
const albumController = require('../controllers/albumController');
const artistController = require('../controllers/artistController');
const genreController = require('../controllers/genreController');
const albuminstanceController = require('../controllers/albuminstanceController');

router.get('/', catalogController.index);

router.get('/albums', albumController.album_list);
router.get('/album/create', albumController.album_create_get);
router.post('/album/create', albumController.album_create_post);
router.get('/album/:id', albumController.album_detail);
router.get('/album/:id/delete', albumController.album_delete_get);
router.post('/album/:id/delete', albumController.album_delete_post);
router.get('/album/:id/update', albumController.album_update_get);
router.post('/album/:id/update', albumController.album_update_post);

router.get('/artists', artistController.artist_list);
router.get('/artist/create', artistController.artist_create_get);
router.post('/artist/create', artistController.artist_create_post);
router.get('/artist/:id', artistController.artist_detail);
router.get('/artist/:id/delete', artistController.artist_delete_get);
router.post('/artist/:id/delete', artistController.artist_delete_post);
router.get('/artist/:id/update', artistController.artist_update_get);
router.post('/artist/:id/update', artistController.artist_update_post);

router.get('/genres', genreController.genre_list);
router.get('/genre/create', genreController.genre_create_get);
router.post('/genre/create', genreController.genre_create_post);
router.get('/genre/:id', genreController.genre_detail);
router.get('/genre/:id/delete', genreController.genre_delete_get);
router.post('/genre/:id/delete', genreController.genre_delete_post);
router.get('/genre/:id/update', genreController.genre_update_get);
router.post('/genre/:id/update', genreController.genre_update_post);

router.get('/albuminstances', albuminstanceController.albuminstance_list);
router.get('/albuminstance/create', albuminstanceController.albuminstance_create_get);
router.post('/albuminstance/create', albuminstanceController.albuminstance_create_post);
router.get('/albuminstance/:id', albuminstanceController.albuminstance_detail);
router.get('/albuminstance/:id/delete', albuminstanceController.albuminstance_delete_get);
router.post('/albuminstance/:id/delete', albuminstanceController.albuminstance_delete_post);
router.get('/albuminstance/:id/update', albuminstanceController.albuminstance_update_get);
router.post('/albuminstance/:id/update', albuminstanceController.albuminstance_update_post);

module.exports = router;
