const Album = require('../models/album');
const AlbumInstance = require('../models/albuminstance');
const Artist = require('../models/artist');
const Genre = require('../models/genre');

exports.index = async function (req, res, next) {
  try {
    const [albumCount, albumInstanceCount, availableAlbumInstanceCount, artistCount, genreCount] = await Promise.all([
      Album.countDocuments({}),
      AlbumInstance.countDocuments({}),
      AlbumInstance.countDocuments({ status: 'Available' }),
      Artist.countDocuments({}),
      Genre.countDocuments({}),
    ]);

    res.render('index', {
      title: 'Music Collection Home',
      data: {
        albumCount,
        albumInstanceCount,
        availableAlbumInstanceCount,
        artistCount,
        genreCount,
      },
    });
  } catch (err) {
    return next(err);
  }
};
