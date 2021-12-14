module.exports = function(database) {  
  const operations = {
    DELETE,
  };
        
  async function DELETE(req, res) {
    const user = req.user;
    const name = req.params.name;
    
    res.status(200).json(await database.deleteAttachment(user.id, name));
  }
    
  return operations;
};