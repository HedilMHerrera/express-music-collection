const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const AlbumInstanceSchema = new Schema({
	album: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
	imprint: { type: String, required: true },
	status: {
		type: String,
		required: true,
		enum: ['Maintenance', 'Available', 'Loaned', 'Reserved'],
		default: 'Maintenance',
	},
	due_back: { type: Date, default: Date.now },
});

AlbumInstanceSchema.virtual('url').get(function () {
	return `/catalog/albuminstance/${this._id}`;
});

AlbumInstanceSchema.virtual('due_back_formatted').get(function () {
	return this.due_back ? DateTime.fromJSDate(this.due_back).toISODate() : '';
});

module.exports = mongoose.model('AlbumInstance', AlbumInstanceSchema);
