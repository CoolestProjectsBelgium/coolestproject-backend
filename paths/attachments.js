module.exports = function(database) {  
  const operations = {
    POST
  };
    
  async function POST(req, res) {
    const user = req.user || null;
    const attachment = req.body;

    const sas = await database.createAttachment(attachment, user.id);
    res.status(200).json(sas);
  }
    
  return operations;
};