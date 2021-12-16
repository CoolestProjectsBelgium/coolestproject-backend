module.exports = function(database) {  
  const operations = {
    POST,
  };
      
  async function POST(req, res) {
    const user = req.user || null;
    const name = req.body.name;
    res.status(200).json(await database.getAttachmentSAS(name, user.id));
  }
  
  return operations;
};