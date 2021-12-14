module.exports = function(jwt) {  
  const addSeconds = require('date-fns/addSeconds');

  const operations = {
    POST
  };
      
  async function POST(req, res) {
    const user = req.user;
  
    const token = await jwt.generateLoginToken(user.id);
    const expires = addSeconds(Date.now(), 172800 || 0);
    res.cookie('jwt', token, { 
      maxAge: 172800 * 1000, 
      httpOnly: true, 
      sameSite: process.env.SAMESITE_COOKIE || 'None', 
      secure: process.env.SECURE_COOKIE === 'true',
      domain: process.env.DOMAIN_COOKIE  });
    res.status(200).json({ expires, language: user.language });
  }

    
  return operations;
};