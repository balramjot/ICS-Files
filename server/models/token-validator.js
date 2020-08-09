const jwt = require('jsonwebtoken');

module.exports = {
    
verifyToken: function (req,res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('unauthorized request');
  }
  let token = req.headers.authorization.split(' ')[1];
  if(token === 'null') {
    return res.status(401).send('unauthorized request');
  }
  let payLoad = jwt.verify(token, 'secretKey');
  if(!payLoad) {
    return res.status(401).send('unauthorized request');
  }
  req.a_name = payLoad.subject;
  next();
}

};