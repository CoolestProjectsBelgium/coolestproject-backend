var dba = require('../service/DBService');
async function main(){  
    // create user with project
    var admin = await dba.createAccount(
        {
            username: 'admin',
            password: "admin",
        }
    );
    console.log('created account: '+ admin.username);
}

main().then(function(ok){
    console.error('done');
}).catch(function(error){
    console.error(error);
});