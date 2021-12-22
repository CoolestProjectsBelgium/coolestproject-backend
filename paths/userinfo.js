module.exports = function(database, models, jwt, mailer) {  
  const Registration = models.Registration;

  const operations = {
    GET,
    DELETE,
    PATCH
  };
  /**
   * 
   * @param {models.User} user 
   * @returns 
   */
  async function getUserDetails(user) {
    const questions = await user.getQuestions();
    const general_questions = [];
    const mandatory_approvals = [];
  
    for (const question of questions) {
      if (question.mandatory) {
        mandatory_approvals.push(question.id);
      } else {
        general_questions.push(question.id);
      }
    }
    const birthDate = new Date(user.birthmonth);
    return {
      language: user.language,
      year: birthDate.getFullYear(),
      month: birthDate.getMonth(),
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      sex: user.sex,
      gsm: user.gsm,
      via: user.via || '',
      medical: user.medical || '',
      email_guardian: user.email_guardian,
      gsm_guardian: user.gsm_guardian,
      t_size: user.sizeId,
      general_questions: general_questions,
      mandatory_approvals: mandatory_approvals,
      address: {
        postalcode: user.postalcode + '' || '',
        street: user.street || '',
        house_number: user.house_number || '',
        bus_number: user.box_number || '',
        municipality_name: user.municipality_name || ''
      },
      delete_possible: await database.isUserDeletable(user.id)
    };
  }
  
  async function GET(req, res) {
    const user = req.user || null;
    const details = await getUserDetails(user);
    res.status(200).json(details);
  }

  async function PATCH(req, res) {
    const user = req.user || null;  
    const changed_fields = req.body;
    await database.updateUser(changed_fields, user.id);
    res.status(200).json(await getUserDetails(await database.getUser(user.id)));
  }
  
  async function DELETE(req, res) {
    const user = req.user || null;
    await database.deleteUser(user.id);
    
    // unflag the first user in the waiting list & trigger activation mail
    const otherRegistration = await Registration.findOne({ where: { waiting_list: true }, order: [['createdAt', 'DESC']]  });
    if (otherRegistration) {
      otherRegistration.waiting_list = false;
      await otherRegistration.save();    
      const event = await database.getEventActive();
      const token = await jwt.generateRegistrationToken(otherRegistration.id);
      await mailer.activationMail(otherRegistration, token, event);
    }
    
    res.status(200).send(null);
  }
    
  return operations;
};