module.exports = function() {    
  const operations = {
    post
  };
        
  async function post(req, res) {
    res.cookie('jwt', null, { 
      maxAge: 0,
      sameSite: process.env.SAMESITE_COOKIE || 'None', 
      secure: process.env.SECURE_COOKIE || true,
      domain: process.env.DOMAIN_COOKIE });

    res.status(200).send(null);
  }
       
  return operations;
};