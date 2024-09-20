const jwt = require('jsonwebtoken');

// const authenticateUser = (req, res, next) => {
//     const token = req.header('Authorization');
//     if(!token) return res.status(401).send('Access denied')

//     try {
//         jwt.verify(token, process.env.JWT_SECRET)

//     } catch (error) {
//         res.status(400).send({message: error})
//     }

//     next();
// }
const authenticateUser = () => {
  return (req, res, next) => {
    const token = req.header('Authorization');
    if (token) {
      next();
    }else{
      return res.status(401).json({ message: 'No token provided' });
    }

    // try {
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   req.user = decoded;
    //   if (!roles.includes(decoded.role)) {
    //     return res.status(403).json({ message: 'Access denied' });
    //   }

    //   next();
    // } catch (err) {
    //   return res.status(401).json({ message: 'Invalid token' });
    // }
  };
};

module.exports= authenticateUser;