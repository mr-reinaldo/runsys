import jwt from 'jsonwebtoken';

function isAuthenticated(req, res, next) {
  try {
    const { authorization } = req.headers;

    const [, token] = authorization.split(' ');

    const { userId, username } = jwt.verify(token, process.env.SECRET_KEY);

    req.userId = userId;
    req.username = username;

    next();
  } catch (error) {
    res.status(401).send({ auth: false, message: 'Token invalid.' });
  }
}

export { isAuthenticated };
