module.exports = function(database) {  
  const operations = {
    POST
  };
    
  async function POST(req, res) {
    const user = req.user;
    const attachment = req.body.attachment;

    res.status(200).json(await database.createAttachment(attachment, user.id));
  }
    
  return operations;
};