module.exports = function(models, database) {
  
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
    
    res.status(200).json(await database.getQuestions(language.substring(0, 2), event));
  }
  
  return operations;
};