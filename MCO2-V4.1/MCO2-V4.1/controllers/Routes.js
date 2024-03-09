//Routes
const responder = require('../models/Responder');
const fs = require('fs');


function add(server){

/******************insert controller code in this area, preferably new code goes at the bottom**************** */

let labPtr = -1;
let seenLabs = [];
let curUserData;
let curUserMail;

// LOGIN load login page 
server.get('/', function(req, resp){
    resp.render('login',{
      layout: 'loginIndex',
      title: 'Login Page'
    });
});

// REGISTER load register page
server.get('/register', function(req, resp){
    resp.render('register',{
      layout: 'registerIndex',
      title: 'Register Page'
    });
});

// Ajax that checks if the email is already registered by another user.
server.post('/email_checker', function(req, resp){
    var email  = String(req.body.email);
    console.log("CONTROL-EMAIL INPUT " + email);
    console.log("CONTROL-EMAIL LENGTH " + email.length)

    responder.isRegisteredUser(email)
    .then(booleanValue => {
        if (booleanValue){
            resp.send({taken : 1})
        } else {
            resp.send({taken : 0})
        }             
    })
    .catch(error => {
        console.error(error);
    });

 
});
// Ajax that checks if passwords match (Will update on password requirements in the future.)
server.post('/password_checker', function(req, resp){
    var password  = String(req.body.password);
    var vpassword = String(req.body.vpassword);
    console.log("PASSWORD " + password)
    console.log("PASSWORDV " + vpassword)
    console.log("CONTROL-PASSWORD MATCH " + password === vpassword)

    if(password === vpassword){
        resp.send({match : 1})
    } else{
        resp.send({match: 0})
    }
});


// CHECK-REGISTER check if register info is valid, success => redirects to login, failure => rerender page
server.post('/register-checker', function(req, resp){
    var userEmail  = String(req.body.email);
    var userName  = String(req.body.username);
    var userPassword = String(req.body.password);
    var userVPassword = String(req.body.vpassword);
    var isTechnician = String(req.body.isTechnician);

    responder.addUser(userEmail, userName, userPassword, userVPassword,isTechnician)
    .then(result => {
        console.log(result);
        if (result == "Success!"){
            resp.redirect('/');
        } else {
            resp.render('register',{
                layout: 'registerIndex',
                title: 'Register Page',
                emailErrMsg: result
              });
        }               
    })
    .catch(error => {
        console.error(error);
    });  
});


// CHECK-LOGIN check if login info is valid, success => redirects to main page, failure => rerender page
    server.post('/login-checker', function(req, resp) {
        let userEmail = req.body.email;
        let userPassword = req.body.password;
        curUserMail = req.body.email;

        responder.getUser(userEmail, userPassword)
        .then(user => {
            if (user != null){
                
                curUserData = user;
                resp.redirect('/mainMenu');
            } else {
                console.log('Email and password don\'t match.');
                resp.render('login',{
                    layout: 'loginIndex',
                    title: 'Login Page',
                    errMsg: 'Email and password don\'t match'
                });
            }             
        })
        .catch(error => {
            console.error(error);
        });

    });

// PROFILE 
server.get('/profile', function(req, resp) {
    
    resp.render('profile',{
        layout: 'profileIndex',
        title: 'Profile',
        user: curUserData
    });
    
});

// MAIN MENU 
server.get('/mainMenu', function(req, resp) {

    // get lab data for display
    responder.getLabs()
    .then(labData => {
        let seenLabs = [];
        for (let i = 0; i < 3 && i < labData.length; i++){
            seenLabs.push(labData[i]);
        }
        labPtr = seenLabs.length;

        // render main menu
        resp.render('mainMenu',{
            layout: 'mainMenuIndex',
            title: 'Main Menu',
            labs: seenLabs,
            user: curUserData
        });         
    })
    .catch(error => {
        console.error(error);
    });
    
    
});

// MAIN PAGE: NEXT BUTTON AJAX
server.post('/nextBtn', function(req, resp) {
    responder.getLabs()
    .then(labData => {
        
        if (labPtr < labData.length){
            seenLabs = [];
            i = labPtr;
            while (i < labPtr+3 && i < labData.length){
                seenLabs.push(labData[i]);
                i++;
            }
            labPtr = i;
        }
        resp.send({labs: seenLabs});
    })
    .catch(error => {
        console.error(error);
    });
    
})

// MAIN PAGE: BACK BUTTON AJAX
server.post('/backBtn', function(req, resp) {
    responder.getLabs()
    .then(labData => {
        
        if (labPtr - seenLabs.length > 0){
            labPtr -= seenLabs.length;
            seenLabs = [];
            
            i = labPtr-3;
            while (i < labPtr && i < labData.length){
                seenLabs.push(labData[i]);
                i++;
            }
        }
        resp.send({labs: seenLabs});
        
    })
    .catch(error => {
        console.error(error);
    });
    
})

//** Please keep new codes below this line, so its easier to append changes in the future. */

// EDIT-PROFILE
server.get('/edit-profile', function(req, resp) {
    resp.render('edit-profile',{
        layout: 'profileIndex',
        title: 'Edit Profile',
        user: curUserData
    });
})

// MAIN PAGE: SIDEBAR PEOPLE
server.post('/load-people', function(req, resp){
    responder.getAllUsers()
    .then(users => {
        resp.send({users: users});
    })
    .catch(error => {
        console.error(error);
    });

})


// PUBLIC PROFILE
server.get('/public-profile/:id/', function(req, resp) {
    console.log('PUBLIC PROFILE OF ' + req.params.id + '!!!!')
    responder.getUserbyId(req.params.id)
    .then(userPublic => {
        if (userPublic.email == curUserData.email){
            resp.redirect('/profile');
        } else {
            resp.render('public-profile',{
                layout: 'profileIndex',
                title: userPublic.username,
                userPublic: userPublic,
                user: curUserData
                });
        }
    })
    .catch(error => {
        console.error(error);
    });
})

// CHANGE USERNAME
server.post('/change_username', function(req, resp){
    var username  = String(req.body.username);
    var email = curUserData.email;
    console.log(username)
    console.log(email)

    responder.changeUsername(curUserData.email,req.body.username)
    .then(booleanValue=>{
        if(booleanValue == true){
            console.log("UsernameChangeSuccess");
            responder.getUserByEmail(email)
            .then(user=>{
                curUserData = user;
            })
            resp.send({username : username});
            console.log("TESTER!" + curUserData);
        } else{
            console.log("UsernameChangeFail");
        }
    })
});

// CHANGE PASSWORD
server.post('/change_password', function(req, resp){

    var password = String(req.body.password);
    var vpassword = String(req.body.vpassword);

    responder.changePassword(curUserData.email,req.body.password,req.body.vpassword)
    .then(booleanValue =>{
        if(booleanValue == true){
            console.log("PasswordChangeSuccess");
            resp.send({message : "Password Change Success!"});
        } else{
            console.log("PasswordChangeFail");
            resp.send({message : "Password Change Failed!"});
        }
    });
});


// LAB VIEW
server.get('/labs/:id/', function(req, resp) {
    console.log('LAB ID OF ' + req.params.id + '!!!!');

    let roomReservations = [];
    let room = [];

    console.log("mail: " + curUserMail)

    responder.getLabById(req.params.id)
    .then(curLab => {
        responder.getUserByEmail(curUserMail)
        .then(name => {
            responder.getReservedYours(curLab, name)
            .then(reserveUser => {
                    responder.getReservedAll(curLab)
                    .then(reserveList => {
                    // Access the resolved data here and extract room values
                    reserveList = reserveList.map(entry => entry.seat);
                    room = reserveList.map(entry => entry.room);
                    
                    reserveUser = reserveUser.map(entry => entry.seat);
                    roomUser = reserveUser.map(entry => entry.room);
                    console.log(reserveUser);

                    resp.render('lab-view', {
                        layout: 'labIndex',
                        title: 'Lab View',
                        user: curUserData,
                        lab: curLab,
                        reserved: reserveList,
                        userRes: reserveUser
                    });


                })

            })

        })
        .catch(error => {
            // Handle errors if the promise is rejected
            console.error("Error occurred:", error);
        });


    })
    .catch(error => {
        console.error(error);
    });

})

server.post('/labdetails', function(req, resp){

    responder.getLabByName(req.body.roomNum)
    .then(curLab => {
        resp.send({lab: curLab});

    })
    .catch(error => {
        console.error(error);
    });

    
});

server.post('/reserve', function(req, resp){
    //date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    //time
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;

    console.log(curUserMail);
    responder.getUserByEmail(curUserMail)
    .then(user=>{
    
    var seat  = String(req.body.seat);
    var room  = String(req.body.room);
    var timeFrame  = "900-930";
    console.log(user);


    responder.addReservation(date, user, time, seat, room, timeFrame)
    })
    resp.send({status: "reserved"});
    
});


// ADD NEW LINES BELOW HERE







/************************no need to edit past this point********************************* */
}

module.exports.add = add;