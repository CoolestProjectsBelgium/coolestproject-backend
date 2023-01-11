module.exports = function(database) {  
  const operations = {
    post,
  };
      
  async function post(req, res) {
    const user = req.user || null;
    const name = req.params.name;
    res.status(200).json(await database.getAttachmentSAS(name, user.id));
  }
  
  return operations;
};