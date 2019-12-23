var dba = require('../service/DBService');

async function main(){

    // create registration with own project
    var registration = await dba.createRegistration(
        {
            "postalcode": 1000,
            "email": "test@test.be",
            "firstname": "Jane",
            "lastname": "Doe",
            "sex": "m",
            "general_questions": [
              "photo"
            ],
            "mandatory_approvals": [
              "ok"
            ],
            "birthmonth": "2010-11-24",
            "t_size": "female_small",
            "via": "string",
            "medical": "string",
            "extra": "string",
            "project_name": "string",
            "project_descr": "string",
            "project_type": "project_type",
            "project_lang": "nl",
            "gsm": "+32460789101",
            "gsm_guardian": "+32460789101",
            "email_guardian": "test@test.be"
        }
    );
    console.log('register' + registration.id );

    // create registration with own project
    var registration = await dba.createRegistration(
        {
            "postalcode": 1000,
            "email": "test@test.be",
            "firstname": "Jane",
            "lastname": "Doe",
            "sex": "m",
            "general_questions": [
              "photo"
            ],
            "mandatory_approvals": [
              "ok"
            ],
            "birthmonth": "2010-11-24",
            "t_size": "female_small",
            "via": "string",
            "medical": "string",
            "extra": "string",
            "project_code": "dummy1234dummy",
            "gsm": "+32460789101",
            "gsm_guardian": "+32460789101",
            "email_guardian": "test@test.be"
        }
    );
    console.log('register' + registration.id );    

    // create user with project
    var owner = await dba.createUserWithProject(
        {
            postalcode: 1000,
            email: "test@test.be",
            gsm: "003237722452",
            firstname: 'John',
            lastname: 'Doe',
            sex: 'm',
            birthmonth: new Date(2003, 01, 01),
            mandatory_approvals: 'aa',
            t_size: 'female_large',
            project: {
                project_name: 'test',
                project_descr: 'aaa',
                project_type: 'aa'
            }
        }
    );
    console.log('created user: '+ owner.id);
    console.log('created project: '+ owner.project.id);
    
    // create vouchers for friends to join
    var voucher1 = await dba.createVoucher(
        owner.project.id
    );

    var voucher2 = await dba.createVoucher(
        owner.project.id
    );
    
    // friends join
    var participant1 = await dba.createUserWithVoucher(
        {
            postalcode: 1000,
            email: "test@test.be",
            gsm: "003237722452",
            firstname: 'John',
            lastname: 'Doe',
            sex: 'm',
            birthmonth: new Date(2003, 01, 01),
            mandatory_approvals: 'aa',
            t_size: 'female_large'
        }, voucher1.id
    );
    console.log('created participant 1: ' + participant1.id)

    var participant2 = await dba.createUserWithVoucher(
        {
            postalcode: 1000,
            email: "test@test.be",
            gsm: "003237722452",
            firstname: 'John',
            lastname: 'Doe',
            sex: 'm',
            birthmonth: new Date(2003, 01, 01),
            mandatory_approvals: 'aa',
            t_size: 'female_large'
        }, voucher2.id
    );
    console.log('created participant 2:' + participant2.id)
    
    // delete participant 2
    var deleteParticipant2 = await dba.deleteUser(
        participant2.id
    );
    console.log('delete participant 2 + token related to user:' + participant2.id)
    
    // owner deletes account + all dependent records
    var deleteOwner = await dba.deleteUser(
        owner.id
    );
    console.log('delete owner + project + tokens' + participant2.id)

    // participant 1 needs to create his own project
    var project2 = await dba.createProject(
        {
            project_name: 'test',
            project_descr: 'aaa',
            project_type: 'project type',
            ownerId: participant1.id 
        }
    );
    console.log('created project ' + project2.id);
    
    //user changes some info on the project
    project2 = await dba.updateProject(
        {
            project_name: 'abcde'
        },
        project2.id
    );
    
    //users chages some info on his profile
    participant1 = await dba.updateUser(
        {
            firstname: 'hello world'   
        },
        participant1.id
    );

}

main().catch(function(error){
    console.error(error);
});