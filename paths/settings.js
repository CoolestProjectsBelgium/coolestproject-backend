module.exports = function(models, database) {
  const User = models.User;
  const Registration = models.Registration;

  const operations = {
    GET
  };

  async function GET(req, res) {
    const user = req.user || null;

    let event = null;
    if(user){
      event = await user.getEvent();
    } else {
      event = await database.getEventActive();
    }
      
    if (!event) {
      throw {
        status: 404,
        message: 'No Active event found',
      };
    }
    let registration_count = 
          await User.count({ where: { eventId: event.id }, lock: true }); 
          
    registration_count += await Registration.count({ lock: true });
      
    res.status(200).json({
      maxAge: event.maxAge,
      minAge: event.minAge,
      startDateEvent: event.eventBeginDate.toISOString().substring(0, 10),
      guardianAge: event.minGuardianAge,
      tshirtDate: event.eventBeginDate.toISOString().substring(0, 10),
      enviroment: process.env.NODE_ENV,
      waitingListActive: (registration_count >= event.maxRegistration),
      maxUploadSize: event.maxFileSize  || 1024 * 1024 * 1024 * 5, // 5 gigs in bytes
      isActive: event.current,
      //maxParticipants: event.
      // max participant in group
      // closing date registration
      // maximum of projects
      // opening date registration
      // video duration
      // video end date (project close date)
      // official start date
    }); 
  }

  return operations;
};