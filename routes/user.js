const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  setUserMe,
  getUserMe,
} = require('../controllers/user');

router.get('/me', getUserMe);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
  }).unknown(true),
}), setUserMe);

module.exports = router;
