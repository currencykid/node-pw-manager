console.log("Starting app"); 

var crypto = require('crypto-js');

var storage = require("node-persist"); 
storage.initSync(); 

var argv = require('yargs')
          .command('create', 'Creates new account', function(yargs){  
             yargs.options({
              name: { 
                demand: true ,
                alias:  'n' ,
                description: 'Account name (ex: Twitter, Facebook)' , 
                type: 'string'
              }, 
              username: { 
                demand: true ,
                alias:  'u' ,
                description: 'Your username or email' , 
                type: 'string'
              }, 
              password: { 
                demand: true ,
                alias:  'p' ,
                description: 'Enter password' , 
                type: 'string'
              }, 
              masterPassword: {
                demand: true, 
                alias: 'm',
                description: "Master password",
                type: 'string'
              }
             }).help('help');
            })

          .command('get', 'Gets existing account', function(yargs){  
              yargs.options({
                name: {
                  demand: true ,
                  alias:  'n' ,
                  description: 'Account name (ex: Twitter, Facebook)' , 
                  type: 'string'
                }, 
              masterPassword: {
                demand: true, 
                alias: 'm',
                description: "Master password",
                type: 'string'
              }
              }).help('help'); 
          })
            .help('help')
            .argv; 

var command = argv._[0]; 

//account will ahve 3 attributes:
//account.name Facebook
//account.username emailaddres or username
//account.password xxxxxxx

function getAccounts(masterPassword){
  var encryptedAccount = storage.getItemSync('accounts');
  var accounts = []; 

  if (typeof encryptedAccount !== 'undefined'){
    var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);   
    accounts = JSON.parse(bytes.toString(crypto.enc.Utf8)); 
  }

  return accounts; 
}

function saveAccounts(accounts, masterPassword){
  
  var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword); 

  storage.setItemSync('accounts', encryptedAccounts.toString());

  return accounts; 
}
  
function createAccount(account, masterPassword){
  var accounts = getAccounts(masterPassword);   

  accounts.push(account); 

  saveAccounts(accounts,masterPassword)

  return account; 
}

function getAccount(accountName, masterPassword) {
  
  var accounts = getAccounts(masterPassword);   
  // iterate oover array and find math
  var matchedAccount; 

  accounts.forEach(function(account){
    if (account.name === accountName) {
      matchedAccount = account; 
    } 
  });

  return matchedAccount; 
}

if (command === 'create'){
  try {
   var createdAccount = createAccount({
      name: argv.name, 
      username: argv.username, 
      password: argv.password
   }, argv.masterPassword); 

   console.log('Account created'); 
   console.log(createdAccount) 

  } catch (e) {
    console.log('Unable to create account.'); 
  }

} else if (command === 'get') {

  try {
    var fetchedAccount = getAccount( argv.name, argv.masterPassword ); 

    if (typeof fetchedAccount === 'undefined'){
      console.log("Account not found"); 
    } else {
      console.log("Account found");
      console.log(fetchedAccount);
    }

  } catch (e) {
    console.log('Unable to fetch account.'); 
  }
} 

//createAccount({
//  name: "Facebook", 
//  username: "email@example.com",
//  password: "password123"
//});
//

// var facebookAccount = getAccount("Facebook"); 

// console.log(facebookAccount); 






//gets computer ready to start writing and saving variables 
//storage.initSync(); 

//storage.setItemSync('surname', 'Andrew'); 


// to get variable you've already saved

//var name = storage.getItemSync('surname'); 
//console.log("Saved name is: " + name); 
//-------------------- exccricse 2 ,, array of object


//storage.initSync(); 

//storage.setItemSync('account', [{ 
//  username : "Andrew", 
//  balance : 0 
//}]);

//var account = storage.getItemSync('account'); 
//console.log(account); 


//-------------------- exccricse 3,, load in accounts array and push on a new account 


//storage.setItemSync('accounts', [{ 
 // username : "Andrew", 
//  balance : 0 
//}]);

//account.push({
//  username: "Jen",
//  balance: 25
//});

//var account = storage.getItemSync('account' , account); 
//console.log(account); 

