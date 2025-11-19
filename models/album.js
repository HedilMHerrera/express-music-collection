const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
	title: { type: String, required: true },
	artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
	summary: { type: String, required: true },
	label: { type: String },
	genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
	release_date: { type: Date },
});

AlbumSchema.virtual('url').get(function () {
	return `/catalog/album/${this._id}`;
});

AlbumSchema.virtual('release_date_formatted').get(function () {
	return this.release_date ? DateTime.fromJSDate(this.release_date).toISODate() : '';
});

module.exports = mongoose.model('Album', AlbumSchema);
