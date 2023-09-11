const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  DocumentNotFoundError,
  CastError,
  ValidationError,
} = require('mongoose').Error;
const {
  CREATED,
} = require('http-status-codes').StatusCodes;

const InternalServerError = require('../utils/errors/internal-server-err');
const ConflictError = require('../utils/errors/conflict-err');
const BadRequestError = require('../utils/errors/bad-request-err');
const NotFoundError = require('../utils/errors/not-found-err');
const UnauthorizedError = require('../utils/errors/unauthorized-err');
const { salt, secret } = require('../utils/dev-env');
const User = require('../models/user');

const { SALT_ROUNDS = salt, JWT_SECRET = secret } = process.env;

module.exports.newUser = (req, res, next) => {
  bcrypt.hash(req.body.password, parseInt(SALT_ROUNDS, 10))
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send({ ...user._doc, password: undefined }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('newUser: Такой пользователь уже существует.'));
        return;
      }
      if (err instanceof ValidationError) {
        next(new BadRequestError(`newUser: Валидация. ${err.message}`));
        return;
      }
      next(new InternalServerError(`newUser: Запись. ${err.message}`));
    });
};

function setUser(id, data, res, next) {
  User.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(`setUser: Валидация. ${err.message}`));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('setUser: Нельзя использовать этот почтовый адрес.'));
        return;
      }
      next(new InternalServerError(`setUser: Обновление. ${err.message}`));
    });
}

function getUser(id, res, next) {
  User.findById(id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('getUser: Пользователь по указанному _id не найден.'));
        return;
      }
      if (err instanceof CastError) {
        next(new BadRequestError('getUser: Задан некорректный _id пользователя.'));
        return;
      }
      next(new InternalServerError(`getUser: ${err.message}`));
    });
}

module.exports.setUserMe = (req, res, next) => {
  setUser(req.user._id, { email: req.body.email, name: req.body.name }, res, next);
};

module.exports.getUserMe = (req, res, next) => {
  getUser(req.user._id, res, next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
    // аутентификация успешна, пользователь в переменной user
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        // токен будет просрочен через неделю после создания
        { expiresIn: '7d' },
      );
      res.send(token);
    })
    .catch((err) => {
      // ошибка аутентификации
      next(new UnauthorizedError(`login: ${err.message}`));
    });
};
