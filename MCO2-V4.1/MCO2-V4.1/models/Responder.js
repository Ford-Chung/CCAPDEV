const { MongoClient, ObjectId } = require('mongodb');
const { emit } = require('process');
const databaseURL = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(databaseURL);



// Database and collection names here...
const databaseName = "REServerDB";
const colUsers = "users";
const colLabs = "labs";
const colReservation = "reservation";
const colSchedule = "schedule";


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
    dbo.createCollection(colReservation)
    .then(successFn).catch(errorFn);
    dbo.createCollection(colSchedule)
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

function getUserByName(name) {
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colUsers);
    searchQuery = { username: name };

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
module.exports.getUserByName = getUserByName;

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


function getLabById(labId){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colLabs);
    searchQuery = { _id: new ObjectId(labId) };

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
module.exports.getLabById = getLabById;

/*************************************************************/
/**RESERVATION RELATED FUNCTIONS AND LABORATORY */
function getLabByName(labName){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colLabs);

    searchQuery = { roomNum: labName };

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
module.exports.getLabByName = getLabByName;

        //save name of the one who reserved
        //save the time
        //save the seat
        //save the room
        //save the time frame
        //anon
function addReservation(date, name, email, bookDate, seat, room, timeFrame, anon, walkin){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colReservation);

    const info = {
        dateTime: date,
        name: name,
        email: email,
        bookDate: bookDate,
        seat: seat,
        room: room,
        timeFrame: timeFrame,
        anon: anon,
        status: "active",
        isWalkin: walkin
      };
      
      col.insertOne(info).then(function(res){
        console.log('reservation created');
      }).catch(errorFn);
}
module.exports.addReservation = addReservation;


function getReservedYours(rooms, name, timeFrame){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colReservation);

    return new Promise((resolve, reject) => {
        const cursor = col.find({ email: name.email, room: rooms.roomNum, timeFrame: timeFrame}); // Filter by roomNum

        cursor.toArray().then(function(vals){
            resolve(vals);
        }).catch(errorFn);
        
    });
}
module.exports.getReservedYours = getReservedYours;

function getReservedAll(rooms, date, timeFrame){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colReservation);


    return new Promise((resolve, reject) => {
        const cursor = col.find({ room: rooms.roomNum, status: "active", bookDate: date, timeFrame: timeFrame}); 

        cursor.toArray().then(function(vals){
            resolve(vals);
        }).catch(errorFn);
        
    });
}
module.exports.getReservedAll = getReservedAll;


function getReservedAll2(rooms, date){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colReservation);


    return new Promise((resolve, reject) => {
        const cursor = col.find({ room: rooms.roomNum, bookDate: date}); 

        cursor.toArray().then(function(vals){
            resolve(vals);
        }).catch(errorFn);
        
    });
}
module.exports.getReservedAll2 = getReservedAll2;


/**Time slots or Schedule functions */

//Date
// time frame
// reserved
// free

function getTimeslots(lab, date, timeFrame){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colSchedule);

    return new Promise((resolve, reject) => {
        const cursor = col.find({roomNum: lab.roomNum, date: date, timeFrame: timeFrame}); //get all timeslots in a specific room and date

        cursor.toArray().then(function(vals){
            resolve(vals);
        }).catch(errorFn);
        
    });
}

module.exports.getTimeslots = getTimeslots;

function getReservedOfPerson (personEmail) {
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(colReservation);

    return new Promise((resolve, reject) => {
        const cursor = col.find({ email: personEmail}); 

        cursor.toArray().then(function(vals){
            resolve(vals);
        }).catch(errorFn);
        
    });
}
module.exports.getReservedOfPerson = getReservedOfPerson;

// this currently just has username, password and bio, change in the future to include pic
// also changes the user param in reservations collection
function updateProfile (userEmail, userName, passWord, userBio) {

    const dbo = mongoClient.db(databaseName);
    const colUser = dbo.collection(colUsers);
    const colReserve = dbo.collection(colReservation);

  
    const updateQuery = { email: userEmail};
    const updateValues = { $set: { username: userName, password: passWord, bio: userBio } };
    const updateValuesReserves = { $set: { name: userName} };


    return new Promise((resolve, reject) => {
        colUser.updateOne(updateQuery, updateValues).then(function(res){

            colReserve.updateMany(updateQuery, updateValuesReserves).then(function(res){
                console.log('Update successful');
                console.log('Inside: '+JSON.stringify(res));
                resolve();
        
              }).catch(errorFn);

          }).catch(errorFn);
    });


}
module.exports.updateProfile = updateProfile;








function finalClose(){
    console.log('Close connection at the end!');
    mongoClient.close();
    process.exit();
}

process.on('SIGTERM',finalClose);  //general termination signal
process.on('SIGINT',finalClose);   //catches when ctrl + c is used
process.on('SIGQUIT', finalClose); //catches other termination commands


