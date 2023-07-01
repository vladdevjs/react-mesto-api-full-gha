const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const UnAuthError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnAuthError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new UnAuthError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
