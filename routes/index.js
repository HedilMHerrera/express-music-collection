var express = require('express');
var router = express.Router();

const Genre = require('../models/genre');
const Album = require('../models/album');

router.get('/', async function(req, res, next) {
  try {
    const genres = await Genre.find().sort({ name: 1 }).exec();

    const agg = await Album.aggregate([
      { $unwind: '$genre' },
      { $group: { _id: '$genre', count: { $sum: 1 } } }
    ]).exec();

    const countMap = {};
    agg.forEach((row) => { countMap[row._id.toString()] = row.count; });

    const genreCounts = genres.map((g) => countMap[g._id.toString()] || 0);
    const genreNames = genres.map((g) => g.name);

    res.render('index', { title: 'Express', genreCounts, genreNames });
  } catch (err) {
    return next(err);
  }
});

router.get('/api/genre-counts', async function(req, res, next) {
  try {
    const genres = await Genre.find().sort({ name: 1 }).exec();

    const agg = await Album.aggregate([
      { $unwind: '$genre' },
      { $group: { _id: '$genre', count: { $sum: 1 } } }
    ]).exec();

    const countMap = {};
    agg.forEach((row) => { countMap[row._id.toString()] = row.count; });

    const genreCounts = genres.map((g) => countMap[g._id.toString()] || 0);
    const genreNames = genres.map((g) => g.name);

    res.json({ genreNames, genreCounts });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
