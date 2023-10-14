const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  newUser,
  login,
} = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().required(),
  }).unknown(true),
}), newUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().min(5),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), login);

router.use('/users', auth, require('./user'));
router.use('/movies', auth, require('./movie'));

module.exports = router;
