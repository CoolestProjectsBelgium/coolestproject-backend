module.exports = function(models, database, azure, mailer) {

  const operations = {
    get,
    post,
    delete:del,
    patch
  };

  /**
 * Get project based on userId
 *
 * userId Integer User id.
 * returns Object project id's with all fields for UI 
 **/
  async function getProjectDetails(userId) {
    const project = await database.getProject(userId);
    if (project == null) {
      return;
    }
    const projectResult = {
      own_project: {
        project_name: project.project_name,
        project_descr: project.project_descr,
        project_type: project.project_type,
        project_lang: project.project_lang,
        participants: [],
        delete_possible: false,
        own_project: (userId === project.ownerId)
      }
    };
  
    const ownProject = projectResult.own_project.own_project;
    const maxTokens = project.max_tokens;
    let assignedTokens = 0;
  
    project.Vouchers.forEach((voucher) => {
      // only show participants to non owners
      if (!ownProject && voucher.participant === null) {
        return;
      }
      let line = {};
      if (voucher.participant) {
        line.name = voucher.participant.firstname + ' ' + voucher.participant.lastname;
        if (userId === voucher.participant.id) {
          line.self = true;
        }
        assignedTokens++;
      } else {
        line.id = voucher.id;
      }
      projectResult.own_project.participants.push(line);
    });
  
    // owner if you are not the owner
    const ownerUser = await project.getOwner();
    if (ownerUser) {
      projectResult.own_project.project_owner = ownerUser.firstname + ' ' + ownerUser.lastname;
    }
    // count remaining tokens
    if (ownProject) {
      projectResult.own_project.remaining_tokens = maxTokens - projectResult.own_project.participants.length;
    }
  
    //delete is not possible when there are participants & it's your own project
    projectResult.own_project.delete_possible = (ownProject && (assignedTokens === 0)) || !ownProject;
  
    //get attachments
    const attachments = [];
    for(const a of await project.getAttachments()){
      if(a.internal){
        continue;
      }
      const blob = await a.getAzureBlob();
      try {

        //skip when the file is not found
        const exists = await azure.checkBlobExists(blob.blob_name, blob.container_name);
        if(!exists){
          console.error(`Blob not found ${ blob.blob_name }`);
        }
  
        const readSAS = await azure.generateSAS(blob.blob_name, 'r', a.filename, blob.container_name);
        attachments.push({
          id: blob.blob_name,
          name: a.name,
          url: (exists) ? readSAS.url: null,
          size: blob.size,
          filename: a.filename,
          confirmed: a.confirmed || false,
          exists: exists
        });
          
      } catch (error) {console.log('Error in blob load');}
    }
    projectResult.attachments = attachments;
   
    console.log(projectResult);
    return projectResult;
  }
  
  async function get(req, res) {
    const user = req.user || null;
    const project = await getProjectDetails(user.id);
    let response_code = 404;
    if(project)
      response_code =200;

    res.status(response_code).json(project);
  }

  async function patch(req, res) {
    const user = req.user || null;
    const project_fields = req.body;

    console.log(project_fields);

    // flatten the response
    const ownProject = project_fields.own_project;
    const project = {
      project_name: ownProject.project_name,
      project_descr: ownProject.project_descr,
      project_type: ownProject.project_type,
      project_lang: ownProject.project_lang,
    };
    await database.updateProject(project, user.id);
    res.status(200).json(await getProjectDetails(user.id));
  }

  async function del(req, res) {
    const user = req.user || null;

    const project = await database.getProject(user.id);
    const event = await user.getEvent();
    await database.deleteProject(user.id);
    await mailer.deleteMail(user, project, event);

    res.status(200).send(null);
  }

  async function post(req, res) {
    const user = req.user || null;
    const project_fields = req.body;

    const project = {};
    const ownProject = project_fields.own_project;
    const otherProject = project_fields.other_project;
    
    if (ownProject) {
      // create new project for this user
      project.project_name = ownProject.project_name;
      project.project_descr = ownProject.project_descr;
      project.project_type = ownProject.project_type;
      project.project_lang = ownProject.project_lang;

      const event = await user.getEvent();
      project.eventId = event.id;
      
      await database.createProject(project, user.id);
    } else if (otherProject) {
      // add user to voucher
      await database.addParticipantProject(user.id, otherProject.project_code);
    }
    res.status(200).json(await getProjectDetails(user.id));
  }
  
  return operations;
};