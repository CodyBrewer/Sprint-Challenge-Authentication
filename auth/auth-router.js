const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/dbConfig.js');

router.post('/register', verifyUserBody, hashUserPass, async (req, res) => {
  // implement registration
  const { user } = req;
  try {
    const registered = await register(user);
    return registered
      ? res.status(201).json(registered)
      : res.status(400).json({ message: 'error inserting user missing informatoion'});
  } catch (err) {
    return res.status(500).json({ message: 'server error', error: err.message });
  }
});

router.post('/login', verifyUserBody, async (req, res) => {
  const { username, password } = req.user;
  
  try {
    const user = await findUserBy({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        return res.status(200).json({ message: `Welcome ${user.username}`, token });
    } else {     
      return res.status(401).json({ message: 'invalid credentials'});
    }
  } catch (err) {
    return res.status(500).json({ message: 'server error', error: err.message });
  }
});

function generateToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: '30m',
  }

  const secret = process.env.JWT_SECRET || 'this should be a secret';

  return jwt.sign(payload, secret, options);
}

function verifyUserBody(req, res, next) {
  const user = req.body;
  if (user.username && user.password){
    req.user = user;
    next();
  } else {
    res.status(401).json({ message: 'user requires username and password in body'});
  }
} 

function hashUserPass(req, res, next) {
  const user = req.user;
  const hash = bcrypt.hashSync(user.password);
  user.password = hash;
  next();
}

async function register(user){
  const registered = await db('users').insert(user);
  
  return registered;
}

async function findUserBy(filter) {
  const user = await db('users').where(filter).first();

  return user;
}



module.exports = router;
