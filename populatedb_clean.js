

const userArgs = process.argv.slice(2);

const Artist = require('./models/artist');
const Genre = require('./models/genre');
const Album = require('./models/album');
const AlbumInstance = require('./models/albuminstance');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

if (!userArgs[0]) {
  console.error('Uso: node populatedb_clean "<mongodb_connection_string>"');
  process.exit(1);
}

const mongoDB = userArgs[0];

const genres = [];
const artists = [];
const albums = [];
const albuminstances = [];

main().catch((err) => console.error(err));

async function main() {
  console.log('Conectando a', mongoDB);
  await mongoose.connect(mongoDB);
  console.log('Conectado. Creando documentos de ejemplo...');
  await createGenres();
  await createArtists();
  await createAlbums();
  await createAlbumInstances();
  console.log('Hecho. Cerrando conexión.');
  await mongoose.connection.close();
}

async function genreCreate(index, name) {
  const g = new Genre({ name });
  await g.save();
  genres[index] = g;
  console.log('Añadido genre:', name);
}

async function artistCreate(index, first_name, family_name, d_birth, d_death) {
  const data = { first_name, family_name };
  if (d_birth) data.date_of_birth = d_birth;
  if (d_death) data.date_of_death = d_death;
  const a = new Artist(data);
  await a.save();
  artists[index] = a;
  console.log('Añadido artist:', a.name);
}

async function albumCreate(index, title, artist, summary, label, genresArr, release_date) {
  const data = { title, artist, summary, label };
  if (genresArr) data.genre = genresArr;
  if (release_date) data.release_date = release_date;
  const al = new Album(data);
  await al.save();
  albums[index] = al;
  console.log('Añadido album:', title);
}

async function albumInstanceCreate(index, album, imprint, status, due_back) {
  const data = { album, imprint };
  if (status) data.status = status;
  if (due_back) data.due_back = due_back;
  const ai = new AlbumInstance(data);
  await ai.save();
  albuminstances[index] = ai;
  console.log('Añadido albuminstance:', imprint);
}

async function createGenres() {
  console.log('Creando genres...');
  await Promise.all([
    genreCreate(0, 'Rock'),
    genreCreate(1, 'Jazz'),
    genreCreate(2, 'Pop'),
    genreCreate(3, 'Electronic'),
  ]);
}

async function createArtists() {
  console.log('Creando artists...');
  await Promise.all([
    artistCreate(0, 'Radio', 'Head', '1985-01-01'),
    artistCreate(1, 'Miles', 'Davis', '1926-05-26', '1991-09-28'),
    artistCreate(2, 'Adele', 'Adkins', '1988-05-05'),
    artistCreate(3, 'Daft', 'Punk', '1993-01-01', '2021-01-01'),
  ]);
}

async function createAlbums() {
  console.log('Creando albums...');
  await Promise.all([
    albumCreate(0, 'In Rainbows', artists[0], 'Seventh album by Radiohead', 'XL Recordings', [genres[0], genres[3]], '2007-10-10'),
    albumCreate(1, 'Kind of Blue', artists[1], 'A landmark jazz album by Miles Davis', 'Columbia', [genres[1]], '1959-08-17'),
    albumCreate(2, '21', artists[2], 'Second studio album by Adele', 'XL/Columbia', [genres[2]], '2011-01-24'),
    albumCreate(3, 'Discovery', artists[3], 'Second album by Daft Punk', 'Virgin', [genres[3], genres[0]], '2001-03-12'),
  ]);
}

async function createAlbumInstances() {
  console.log('Creando album instances...');
  await Promise.all([
    albumInstanceCreate(0, albums[0], 'Original pressing - UK', 'Available'),
    albumInstanceCreate(1, albums[0], 'Reissue 2016', 'Loaned'),
    albumInstanceCreate(2, albums[1], 'Stereo remaster', 'Available'),
    albumInstanceCreate(3, albums[2], 'Deluxe edition', 'Maintenance'),
    albumInstanceCreate(4, albums[3], 'Vinyl pressing', 'Available'),
  ]);
}
