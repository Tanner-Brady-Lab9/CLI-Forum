'use strict';

const logger = (req, res, next) => {
  console.log('REQUEST:', req.method, req.path);

  // Call next() so that the next function in line can do it's work
  next();
};

module.exports = logger;