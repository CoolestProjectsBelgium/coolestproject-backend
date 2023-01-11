module.exports = function(database) {  
  const operations = {
    post
  };
    
  async function post(req, res) {
    const user = req.user || null;
    const attachment = req.body;

    const sas = await database.createAttachment(attachment, user.id);
    
    res.status(200).json(sas);
  }
    
  return operations;
};