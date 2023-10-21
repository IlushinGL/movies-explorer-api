const {
  DocumentNotFoundError,
  CastError,
  ValidationError,
} = require('mongoose').Error;
const {
  CREATED,
} = require('http-status-codes').StatusCodes;

const InternalServerError = require('../utils/errors/internal-server-err');
const ForbiddenError = require('../utils/errors/forbidden-err');
const BadRequestError = require('../utils/errors/bad-request-err');
const NotFoundError = require('../utils/errors/not-found-err');
const Movie = require('../models/movie');

module.exports.getMoviesCollection = (req, res, next) => {
  if (!req.user) {
    next(new ForbiddenError('getMoviesCollection: Требуется авторизация.'));
    return;
  }
  Movie.find({ owner: req.user })
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(new InternalServerError(`getMoviesCollection: Поиск. ${err.message}`));
    });
};

module.exports.deleteMovieItem = (req, res, next) => {
  if (req.body.owner !== req.user._id) {
    next(new ForbiddenError('deleteMovieItem: Изменение чужих коллекций запрещено.'));
    return;
  }
  Movie.findById(req.params._id)
    .then((item) => {
      Movie.deleteOne(item)
        .then(() => {
          res.send(item);
        })
        .catch((err) => {
          next(new InternalServerError(`deleteMovieItem: ${err.message}`));
        });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('deleteMovieItem: В коллекции нет записи с указанным _id.'));
        return;
      }
      if (err instanceof CastError) {
        next(new BadRequestError('deleteMovieItem: Передан некорректный _id записи.'));
        return;
      }
      next(new InternalServerError(`deleteMovieItem: ${err.message}`));
    });
};

module.exports.createMovieItem = (req, res, next) => {
  if (req.body.owner !== req.user._id) {
    next(new ForbiddenError('createMovieItem: Изменение чужих коллекций запрещено.'));
    return;
  }
  Movie.create(req.body)
    .then((item) => { res.status(CREATED).send(item); })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(`createMovieItem: Проверка. ${err.message}`));
        return;
      }
      next(new InternalServerError(`createMovieItem: Запись. ${err.message}`));
    });
};
