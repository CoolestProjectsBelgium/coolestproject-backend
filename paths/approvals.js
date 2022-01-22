module.exports = function(database) {  
  const operations = {
    GET
  };
  
  async function GET(req, res) {
    const user = req.user || null;
    const language = req.language || null;

    let event = null;
    if(user){
      event = await user.getEvent();
    } else {
      event = await database.getEventActive();
    }
    
    res.status(200).json(await database.getApprovals(language, event));
  }

  return operations;
};