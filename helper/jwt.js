const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
const response = require('./response');

const authUser = (req, res, next) => {
  //Find jwt in header
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send(response('Please login', {}, false));
  } else {
    //Validate jwt token
    const tokenBody = token.slice(7);
    jwt.verify(tokenBody, secret, (error, user) => {
      if (error) {
        console.log('Jwt Error:', error.message);
        return res.status(401).send(response(' Unauthorized', {}, false));
      }

      req.user = user;
      next();
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    res.status(200);
    next();
  } else {
    return res.status(401).send(response(' Access Denied', {}, false));
  }
};

module.exports = {
  authUser,
  isAdmin
};
