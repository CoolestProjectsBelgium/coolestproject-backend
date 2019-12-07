/*
var models = require('../models');
var Project = models.Project;
var User = models.User;
var Voucher = models.Voucher;
var sequelize = models.sequelize;
var crypto = require('crypto');

//const uuidv4 = require('uuid/v4');

/*
var userPromise = new Promise(function (resolve, reject) {
    var user = {
        postalcode: 1000,
        email: "test@test.be",
        firstname: 'John',
        lastname: 'Doe',
        sex: 'm',
        birthmonth: new Date(2003,01,01),
        mandatory_approvals: 'aa',
        t_size: 'female_large'
    }
    User.create(user).then(user => {
        resolve(user);
    }).catch((err) => {
        reject(err)
    });
}).then( function(user){
    console.log(user.id);
}).catch(function(error){
    console.log(error);
});
*/

/*
// create user with own project
var user = {
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
User.create(user, { include: ['project'] }).then(function (user) {
    console.log(user);
}).catch(function (error) {
    console.log(error);
});
*/
/*
// create voucher
async function createVoucher(projectId) {
    var totalVouchers = await Voucher.count({ where: { projectId: projectId } });

    if (totalVouchers >= 2) {
        throw new Error('Max token reached');
    }

    var token = await new Promise(function (resolve, reject) {
        crypto.randomBytes(18, function (error, buffer) {
            if (error) {
                reject(error);
            }
            resolve(buffer.toString('hex'));
        });
    });
    await Voucher.create({ projectId: projectId, id: token });
}

createVoucher(2).catch(function(error){
    console.error(error);
});



/*
token.then(function(token){
    console.log(token);
});

/*




    var voucher = {
        projectId: 1,
        id: token
    }
    Voucher.create(voucher).then(function(voucher){
        console.log(voucher);
    }).catch(function (error) {
        console.log(error);
    });

});

// update voucher with new user
//Voucher.findByPk('507397d06d8b13941fcc52bd6613b43fae83',{ include: ['participant'] }).then(function(voucher){});

// create new user and add voucher
/*
sequelize.transaction(function (t) {
    var user = {
        postalcode: 1000,
        email: "test@test.be",
        gsm: "003237722452",
        firstname: 'John',
        lastname: 'Doe',
        sex: 'm',
        birthmonth: new Date(2003, 01, 01),
        mandatory_approvals: 'aa',
        t_size: 'female_large'
    }
    return User.create(user, { transaction: t }).then(function (user) {
        return Voucher.findOne({ where: { id: '507397d06d8b13941fcc52bd6613b43fae83', participantId: null }, transaction: t, lock: true }).then(function (voucher) {
            if (voucher === null) {
                throw new Error('Token not found of incorrect');
            }
            return voucher.setParticipant(user, { transaction: t })
        });
    });
}).catch(function (error) {
    console.error(error);
});
*/

/*
// create Voucher for project
var voucher = {
    projectId: 1
}
Voucher.create(voucher).then(function(user){
    console.log(error);
}).catch(function (error) {
    console.log(error);
});
*/

/*
var project = {
    project_name: 'test',
    project_descr: 'aaa',
    project_type: 'aa',
    owner: {
        postalcode: 1000,
        email: "test@test.be",
        firstname: 'John',
        lastname: 'Doe',
        sex: 'm',
        birthmonth: new Date(2003, 01, 01),
        mandatory_approvals: 'aa',
        t_size: 'female_large'
    }
}
Project.create(project, { include: ['owner'] });
*/

/*
User.findOne({
    where: {
        id: 1
    },
    include: 'owner'
}).then(function(user){
    console.log(user);
});
*/
var jwt = require('jsonwebtoken');

var userName = 'test';

var token = jwt.sign({ id: userName }, process.env.SECRET_KEY, {
    expiresIn: 86400 // expires in 24 hours
});

console.log(token);

new Promise(function(resolve, reject){
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if (err) {
            reject({ auth: false, message: 'Failed to authenticate token.' });
        } else {
            resolve(decoded);
        }
    });
}).then(function(result){
    console.log(result);
}).catch(function(error){
    console.log(error);
});

