'use strict';

module.exports = (capability) => {

  return (req, res, next) => {

    try {
      console.log(req.users.capabilities, 'HELLLLLLLLLLLLLLLLLLLLLL');
      if (req.users.capabilities.includes(capability)) {
        next();
      }
      else {
        next('Access Denied');
      }
    } catch (e) {
      next('Invalid Login');
    }

  };

};
