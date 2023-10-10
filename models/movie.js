const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'страна создания фильма не указана'],
  },
  director: {
    type: String,
    required: [true, 'не указан режиссёр фильма'],
  },
  duration: {
    type: Number,
    required: [true, 'не указана длительность фильма'],
    min: [0, 'длительность не может быть отрицательной'],
  },
  year: {
    type: String,
    required: [true, 'не указан год выпуска фильма'],
  },
  description: {
    type: String,
    required: [true, 'нет описания фильма'],
  },
  image: {
    type: String,
    required: [true, 'не указан URL постера фильма'],
    validate: {
      validator: (v) => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true,
      }),
      message: () => 'некорректный URL постера',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'не указан URL трейлера фильма'],
    validate: {
      validator: (v) => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true,
      }),
      message: () => 'некорректный URL трейлера',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'не указан URL миниатюры постера'],
    validate: {
      validator: (v) => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true,
      }),
      message: () => 'некорректный URL миниатюры',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'не указан владелец коллекции'],
  },
  movieId: {
    type: Number,
    required: [true, 'не определён ИД фильма'],
  },
  nameRU: {
    type: String,
    required: [true, 'не указано название фильма на русском языке'],
  },
  nameEN: {
    type: String,
    required: [true, 'не указано название фильма на английском языке'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
