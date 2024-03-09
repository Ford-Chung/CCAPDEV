//Routes
const responder = require('../models/Responder');


function add(server){

/******************insert controller code in this area, preferably new code goes at the bottom**************** */

let labPtr = -1;
let seenLabs = [];
let curUserData;

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

    console.log(curUserData);
    
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

}

/******************************************************************************** */










module.exports.add = add;