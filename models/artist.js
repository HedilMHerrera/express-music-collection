const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
	first_name: { type: String, required: true, maxLength: 100 },
	family_name: { type: String, required: true, maxLength: 100 },
	date_of_birth: { type: Date },
	date_of_death: { type: Date },
});

// Virtual para el nombre completo del artista
ArtistSchema.virtual('name').get(function () {
	return `${this.family_name}, ${this.first_name}`;
});

// Virtual para la URL del artista
ArtistSchema.virtual('url').get(function () {
	return `/catalog/artist/${this._id}`;
});

// Virtuales para fechas formateadas
ArtistSchema.virtual('date_of_birth_formatted').get(function () {
	return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toISODate() : '';
});

ArtistSchema.virtual('date_of_death_formatted').get(function () {
	return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toISODate() : '';
});

module.exports = mongoose.model('Artist', ArtistSchema);
