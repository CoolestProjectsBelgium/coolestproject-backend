'use strict';

const dba = require('../service/DBService');
async function main(){  
    // create user with project
    var admin = await dba.createAccount(
        {
            username: 'admin',
            password: "admin",
        }
    )
    console.log('created account: '+ admin.username);
}

main();


  