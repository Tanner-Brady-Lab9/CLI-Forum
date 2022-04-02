'use strict';

module.exports = (capability) => {

  return (req, res, next) => {
    try {
      console.log("ACL LOG", req.user.capabilities);
      // [ 'read' ]                        'user' 
      if (req.user.capabilities.includes(capability)) {
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
