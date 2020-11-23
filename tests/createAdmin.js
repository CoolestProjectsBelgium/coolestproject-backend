'use strict';

const dba = require('../dba');
async function main() {
    // create user with project
    var admin = await dba.createAccount(
        {
            email: 'admin',
            password: "admin",
        }
    )
    console.log('created account: ' + admin.email);
}

main();


