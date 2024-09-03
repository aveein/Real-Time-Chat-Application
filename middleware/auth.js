const jwt = require('jsonwebtoken');
const config = require('../config');

// function authMiddleware(req, resp, next) {
//     const header = req.header('Authorization');
//     if(!header) {
//         return resp.status(401).send({message: 'Access denined, no token provided'});
//     }
//     const token = header.replace('Bearer ', '');
//     try {
//         const decodedUser = jwt.verify(token, config.secret);
//         req.user = decodedUser;
//         next();
//     }catch(error) {
//         return resp.status(400).send({message: 'Invalid token..'});
//     }
// }

function authMiddleware(req, res, next) {
    const header = req.session.token;
    console.log(config.secret,header);
    if (!header) {
      return res.redirect('/login')
    }
    
  
  
  
    try {
      const decodedUser = jwt.verify(header, config.secret);
      req.user = decodedUser;
      next();
      }catch(error) {
        
          return res.status(400).send({message: 'Invalid token..'});
      }
}


module.exports = authMiddleware;