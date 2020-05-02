/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  const secret = process.env.JWT_SECRET || 'this should be a secret';

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
     if (err) {
       res.status(401).json({ you: 'shall not pass!' });
     } else {
       req.decodedToken = decodedToken;
       next();
     }
    });
  } else {
    res.status(400).json({ message: 'no token provided' });
  }
};
