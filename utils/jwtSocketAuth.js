const jwt = require('jsonwebtoken');

const jwtSocketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) return next(new Error("No token provided"));

  try {
    const user = jwt.verify(token, "your_jwt_secret");
    socket.user = user;
    next();
  } catch (err) {
    return next(new Error("Invalid token"));
  }
};

module.exports = jwtSocketAuth;
