const DBA = require('../dba'); 

/**
 * get event by id
 * @param {DBA} database
 */
module.exports = function(models, database) {
  const User = models.User;
  const Registration = models.Registration;

  const operations = {
    GET
  };

  async function GET(req, res) {
    
    const user = req.user || null;

    var event = null;
    if(user){
      event = await user.getEvent();
    } else {
      event = await database.getEventActive();
    }

    console.log(event);

    if (!event) {
      res.status(404).json({
        message: 'No active event',
        code: '001'
      });
      return;
    }
    let registration_count = 
          await User.count({ where: { eventId: event.id }, lock: true }); 
          
    registration_count += await Registration.count({ lock: true });
      
    res.status(200).json({
      maxAge: event.maxAge,
      minAge: event.minAge,
      //startDateEvent: event.eventBeginDate.toISOString().substring(0, 10),
      guardianAge: event.minGuardianAge,
      enviroment: process.env.NODE_ENV,
      waitingListActive: (registration_count >= event.maxRegistration),
      maxUploadSize: event.maxFileSize  || 1024 * 1024 * 1024 * 5, // 5 gigs in bytes

      startDateEvent: event.eventBeginDate.toISOString().substring(0, 10),
      tshirtDate: event.eventBeginDate.toISOString().substring(0, 10),

      isActive: event.current,

      eventBeginDate: event.eventBeginDate.toISOString().substring(0, 10),
      registrationOpenDate: event.registrationOpenDate.toISOString().substring(0, 10),
      registrationClosedDate: event.registrationClosedDate.toISOString().substring(0, 10),
      projectClosedDate: event.projectClosedDate.toISOString().substring(0, 10),
      officialStartDate: event.officialStartDate.toISOString().substring(0, 10),
      eventEndDate: event.eventEndDate.toISOString().substring(0, 10),
      eventTitle: event.event_title,

      isRegistrationClosed: event.registrationClosed,
      isProjectClosed: event.projectClosed,

      maxRegistration: event.maxRegistration,
      maxParticipants: event.maxVoucher

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