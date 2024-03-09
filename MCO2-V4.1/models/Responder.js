const { MongoClient, ObjectId } = require('mongodb');
const { emit } = require('process');
const databaseURL = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(databaseURL);



// Database and collection names here...
const databaseName = "REServerDB";
const colUsers = "users";
const colLabs = "labs";


function errorFn(err){
    console.log('Error found. Please trace!');
    console.error(err);
}

function successFn(res){
    console.log('Database query successful!');
}



mongoClient.connect().then(function(con){
  console.log("Attempt to create!");
  const dbo = mongoClient.db(databaseName);
  dbo.createCollection(colUsers)
    .then(successFn).catch(errorFn);
    dbo.createCollection(colLabs)
    .then(successFn).catch(errorFn);
}).catch(errorFn);



/******response functions to interact with database**********/


function getUser(userEmail, userPassword) {
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colUsers);
    searchQuery = { email: userEmail, password: userPassword };

    return new Promise((resolve, reject) => {
        col.findOne(searchQuery).then(function (val) {
            if (val != null) {
                resolve(val);
            } else {
                resolve(null);
            }
        }).catch(reject);
    });
}
module.exports.getUser = getUser;


function addUser(userEmail, userName, userPassword, userVPassword,isTechnician){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colUsers);
    searchQuery = {email: userEmail};
    return new Promise((resolve, reject) => {
        col.findOne(searchQuery).then(function(val){
            if (val != null){
                resolve('Email already in use.');
            } else if (userPassword != userVPassword){
                resolve('Passwords do not match.');
            } else {
                if(isTechnician === 'on'){
                    isTechnician = true;
                } else{
                    isTechnician = false;
                }
                const info = {
                    email: userEmail,
                    password: userPassword,
                    isTechnician: isTechnician,
                    pfp: 'amogus.png',
                    username: userName,
                    bio: ""
                };
                col.insertOne(info).then(function(res){
                }).catch(errorFn);
                resolve('Success!');
            }
        }).catch(reject);
    });
}
module.exports.addUser = addUser;


function getLabs(){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colLabs);

    return new Promise((resolve, reject) => {
        const cursor = col.find({});
        cursor.toArray().then(function(vals){
            resolve(vals);
        }).catch(errorFn);
        
    });
    
}
module.exports.getLabs = getLabs;


function getAllUsers() {
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colUsers);

    return new Promise((resolve, reject) => {
        const cursor = col.find({});
        cursor.toArray().then(function(vals){
            resolve(vals);
        }).catch(errorFn);
        
    });
}
module.exports.getAllUsers = getAllUsers;


function getUserbyId(userId) {
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colUsers);
    console.log(typeof(userId));
    searchQuery = { _id: new ObjectId(userId) };

    return new Promise((resolve, reject) => {
        col.findOne(searchQuery).then(function (val) {
            if (val != null) {
                resolve(val);
            } else {
                resolve(null);
            }
        }).catch(reject);
    });
}
module.exports.getUserbyId = getUserbyId;

function isRegisteredUser(inputEmail){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colUsers);

    searchQuery = {email : inputEmail}
    return new Promise((resolve, reject) => {
        col.findOne(searchQuery).then(function (val) {
            if (val != null) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(reject);
    });
}
module.exports.isRegisteredUser = isRegisteredUser;

/*************************************************************/

function changeUsername(email,username){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colUsers);

    const updateQuery = { email : email};
    const updateValues = { $set: {username : username}};

    return new Promise((resolve,reject) =>{
        col.updateOne(updateQuery,updateValues).then(function(res){
            if(res['modifiedCount'] > 0){
                resolve(true);
            } else{
                resolve(false);
            }

        });
    });
}
module.exports.changeUsername = changeUsername;

function getUserByEmail(userEmail) {
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colUsers);
    searchQuery = { email: userEmail };

    return new Promise((resolve, reject) => {
        col.findOne(searchQuery).then(function (val) {
            if (val != null) {
                resolve(val);
            } else {
                resolve(null);
            }
        }).catch(reject);
    });
}
module.exports.getUserByEmail = getUserByEmail;

function changePassword(userEmail,password,vpassword){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colUsers);

    const updateQuery = { email: userEmail };
    const updateValues = { $set: {password : password}};

    return new Promise((resolve, reject) => {
        if(password === vpassword){
            col.updateOne(updateQuery,updateValues).then(function(res){
                if(res['modifiedCount'] > 0){
                    resolve(true);
                } else{
                    resolve(false);
                }
            });
        } else{
            resolve(false);
        }
    })
}
module.exports.changePassword = changePassword;


function finalClose(){
    console.log('Close connection at the end!');
    mongoClient.close();
    process.exit();
}

process.on('SIGTERM',finalClose);  //general termination signal
process.on('SIGINT',finalClose);   //catches when ctrl + c is used
process.on('SIGQUIT', finalClose); //catches other termination commands


