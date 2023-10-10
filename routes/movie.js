const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMoviesCollection,
  deleteMovieItem,
  createMovieItem,
} = require('../controllers/movie');

const validUrl = require('../utils/validators');

router.get('/', getMoviesCollection);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().min(0).required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(validUrl()).required(),
    trailerLink: Joi.string().pattern(validUrl()).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(validUrl()).required(),
    movieId: Joi.number().required(),
  }).unknown(true),
}), createMovieItem);

router.delete('/:_id', celebrate({
  // валидируем параметр
  params: Joi.object().keys({
    _id: Joi.string().hex().required(),
  }),
}), deleteMovieItem);

module.exports = router;
