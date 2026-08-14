  const jwt = require('jsonwebtoken')
  function generateToken(payload){
    try{
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return token;
    }catch(err){
      console.error('Worse than my squad: ',err);
    }
  }
  function verifyToken(token){
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      return decoded;
    }catch(err){
      console.error('Yeah it is down again, so  i found a ', err)
    }
  }
  module.exports={generateToken, verifyToken};