//Routes
const { timeEnd, info } = require('console');
const responder = require('../models/Responder');
const fs = require('fs');


function dateToVerbose(inputDate){
    const dateObject = new Date(inputDate);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const verboseDate = dateObject.toLocaleString('en-US', options);
    
    return verboseDate;

}

function dateToShortVerbose(inputDate){
    const dateObject = new Date(inputDate);

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const verboseDate = dateObject.toLocaleString('en-US', options);

    return verboseDate;
}


function separateDateAndTime(dateTimeString) {
    const [datePart, timePart] = dateTimeString.split('|');
    const dateObject = new Date(datePart);
  
    const formattedDate = dateObject.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  
    const formattedTime = timePart.split(':').slice(0, 2).join(':'); // Removing seconds
  
    return { formattedDate, formattedTime };
}

function removeSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
}



function add(server){

/******************insert controller code in this area, preferably new code goes at the bottom**************** */

let labPtr = -1;
let seenLabs = [];
let curUserData;
let curUserMail;
let curLabId;
let searchQuery;

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
    
    responder.getReservedOfPerson(curUserData.email)
    .then(myReserves => {

        for (let i = 0; i < myReserves.length; i++){
            myReserves[i].bookDateVerbose = dateToVerbose(myReserves[i].bookDate);
            myReserves[i].bookDateShortVerbose = dateToShortVerbose(myReserves[i].bookDate);
            let dateAndTime = separateDateAndTime(myReserves[i].dateTime);
            myReserves[i].dateLogged = dateToVerbose(dateAndTime.formattedDate);
            myReserves[i].timeLogged = removeSeconds(dateAndTime.formattedTime);
        }


        resp.render('profile',{
            layout: 'profileIndex',
            title: 'Profile',
            user: curUserData,
            reserves: myReserves
        });
       
    })
    .catch(error => {
        console.error(error);
    });
});

// MAIN MENU 
server.get('/mainMenu', function(req, resp) {
    if(req.query.labs != null){
        let labs = [];
        labs = JSON.parse(req.query.labs);
        resp.render('mainMenu', {
            layout: 'mainMenuIndex',
            title: 'Main Menu',
            labs: labs,
            user: curUserData
        });
    } else{
    // get lab data for display
    searchQuery = null;
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
    }
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
    if(searchQuery != null){
        responder.userSearch(searchQuery)
        .then(users => {
            resp.send({users:users,searchQuery : searchQuery});
        }).catch (error =>{
            console.error(error);
        });
    } else{
        responder.getAllUsers()
        .then(users => {
            resp.send({users: users, searchQuery: "What are you looking for?"});
        })
        .catch(error => {
            console.error(error);
        });
    }
})


// PUBLIC PROFILE
server.get('/public-profile/:id/', function(req, resp) {
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

    responder.changeUsername(curUserData.email,req.body.username)
    .then(booleanValue=>{
        if(booleanValue == true){
            console.log("UsernameChangeSuccess");
            responder.getUserByEmail(email)
            .then(user=>{
                curUserData = user;
            })
            resp.send({username : username});
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
    curLabId = req.params.id;
    let roomReservations = [];
    let room = [];

    console.log("mail: " + curUserMail)

    responder.getLabById(req.params.id)
    .then(curLab => {
        responder.getUserByEmail(curUserMail)
        .then(name => {
            responder.getTimeslots(curLab, getCurrentDate())
            .then(dateData => {

                dateData = sortByStartTime(dateData);

                let timeFrame;

                if(dateData.length != 0){
                    timeFrame = dateData[0].timeStart + "-" + dateData[0].timeEnd;
                } 

                responder.getReservedYours(curLab, name, timeFrame)
                .then(reserveUser => {
                        responder.getReservedAll(curLab, getCurrentDate(), timeFrame)
                        .then(reserveList => {
                            responder.getReservedAll2(curLab, getCurrentDate())
                            .then(reserveListAll => {
                                // Access the resolved data here and extract room values
                                reserveList = reserveList.map(entry => entry.seat);
                                room = reserveList.map(entry => entry.room);
                                
                                //for the current user reservation
                                reserveUser = reserveUser.map(entry => entry.seat);
                                roomUser = reserveUser.map(entry => entry.room);

                                if(name.isTechnician){
                                    resp.render('lab-view-tech', {
                                        layout: 'labIndex-tech',
                                        title: 'Lab View Tech',
                                        user: curUserData,
                                        lab: curLab,
                                        reserved: reserveList,
                                        userRes: reserveUser,
                                        dateData: dateData,
                                        date: getCurrentDate(),
                                        resData: reserveListAll
                                    });
                                }else{
                                    resp.render('lab-view', {
                                        layout: 'labIndex',
                                        title: 'Lab View',
                                        user: curUserData,
                                        lab: curLab,
                                        reserved: reserveList,
                                        userRes: reserveUser,
                                        dateData: dateData,
                                        date: getCurrentDate()
                                    });
                                }
                            })
                            
                        })
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


server.post("/modal", function(req, resp){
    responder.getLabByName(req.body.roomNum)
    .then(curLab => {
        responder.getReservedAll(curLab, req.body.date, req.body.timeFrame)
        .then(reservations =>{
            responder.getUserByEmail(curUserMail)
            .then(user => {

                let modal = 'A';
                let name;
                
                for(let i = 0; i < reservations.length; i++){
                    //if current seat is reserved
                    if(reservations[i]["seat"] == String(req.body.seat)){
                        
                        name = reservations[i].name;

                        //if cur user is the one that reserved
                        if(reservations[i].email == user.email){
                            //if anonymous
                            if(reservations[i].anon){
                                modal = 'E';
                            }else{
                                modal = 'D';
                            }
                        }else if(reservations[i].isWalkin){
                            if(reservations[i].anon){
                                modal = 'C';
                            }else{
                                modal = 'F';
                            }
                        }else{
                            if(reservations[i].anon){
                                modal = 'C';
                            }else{
                                modal = 'B';
                            }
                        }
                    }
                }

                
                responder.getUserByName(name)
                .then(user2 => {
                    resp.send({modal, name, user: user2});

                })
                .catch(error => {
                    console.error(error);
                });
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    })
    .catch(error => {
        console.error(error);
    });
});


server.post("/modalTech", function(req, resp){
    responder.getLabByName(req.body.roomNum)
    .then(curLab => {
        responder.getReservedAll(curLab, req.body.date, req.body.timeFrame)
        .then(reservations =>{
            responder.getUserByEmail(curUserMail)
            .then(user => {

                let modal = 'A';
                let name;
                
                for(let i = 0; i < reservations.length; i++){
                    //if current seat is reserved
                    if(reservations[i]["seat"] == String(req.body.seat)){
                        
                        name = reservations[i].name;

                        //if cur user is tech user
                        if(reservations[i].isWalkin){
                            //if anonymous
                            if(reservations[i].anon){
                                modal = 'E';
                            }else{
                                modal = 'D';
                            }
                        }else{
                            if(reservations[i].anon){
                                modal = 'C';
                            }else{
                                modal = 'B';
                            }
                        }
                    }
                }

                
                responder.getUserByName(name)
                .then(user2 => {
                    resp.send({modal, name, user: user2});

                })
                .catch(error => {
                    console.error(error);
                });
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    })
    .catch(error => {
        console.error(error);
    });
});

server.post('/reserve', function(req, resp){
    const currentDate = new Date();
    const date = getCurrentDate();

    //time
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;

    responder.getUserByEmail(curUserMail)
    .then(user=>{
    
    var seat  = String(req.body.seat);
    var room  = String(req.body.room);
    var timeFrame  = String(req.body.timeFrame);
    var anon = req.body.anon == 'true';
    var resDate = req.body.date;
    var walkin = user.isTechnician;

    if(walkin){
        responder.addReservation(date+ "|" +time, req.body.name, req.body.email, resDate, seat, room, timeFrame, anon, walkin)
    }else{
        responder.addReservation(date+ "|" +time, user.username, user.email, resDate, seat, room, timeFrame, anon, walkin)
    }

        let obj = {
            dateTime: date+ "|" +time,
            name: req.body.name,
            email: req.body.email,
            bookDate: resDate,
            seat: seat,
            room: room,
            timeFrame: timeFrame,
            anon: anon,
            status: "active",
            isWalkin: walkin,
        };

        resp.send({status: "reserved", reserve: obj});
                
    })
    .catch(error => {
        console.error(error);
    });

    
    
});

server.post('/getTimeFrames', function(req, resp){
    responder.getLabById(curLabId)
    .then(curLab => {
        responder.getTimeslots(curLab, req.body.date)
        .then(dateData => { 
            resp.send({dateData : dateData});
                
        })
        .catch(error => {
            console.error(error);
        });

    })
    .catch(error => {
        console.error(error);
    });
})

server.post('/dateChange', function(req, resp){
    let roomReservations = [];
    let room = [];
    let timeFrame;


    responder.getLabById(curLabId)
    .then(curLab => {
        responder.getUserByEmail(curUserMail)
        .then(name => {
            responder.getTimeslots(curLab, req.body.date)
            .then(dateData => {
                dateData = sortByStartTime(dateData);

                if(dateData.length != 0){
                    if(req.body.changed == 1){
                        timeFrame = dateData[0].timeStart + "-" + dateData[0].timeEnd;
                    }else {
                        timeFrame = req.body.timeFrame;
                    }
                }

                responder.getReservedYours(curLab, name, timeFrame)
                .then(reserveUser => {
                        responder.getReservedAll(curLab, String(req.body.date), timeFrame)
                        .then(reserveList => { 
                            responder.getReservedAll2(curLab, String(req.body.date), timeFrame)
                            .then(reserveListAll => {
                                // Access the resolved data here and extract room values
                                reserveList = reserveList.map(entry => entry.seat);
                                room = reserveList.map(entry => entry.room);

                                //for the current user reservation
                                reserveUser = reserveUser.map(entry => entry.seat);
                                roomUser = reserveUser.map(entry => entry.room);
                                

                                if(name.isTechnician){
                                    resp.send({
                                        user: curUserData,
                                        lab: curLab,
                                        reserved: reserveList,
                                        userRes: reserveUser,
                                        dateData: dateData,
                                        date: req.body.date,
                                        resData: reserveListAll
                                    });
                                }else{
                                    resp.send({
                                        user: curUserData,
                                        lab: curLab,
                                        reserved: reserveList,
                                        userRes: reserveUser,
                                        dateData: dateData,
                                        date: req.body.date
                                    });
                                }
                            })
                            .catch(error => {
                                console.error(error);
                            });
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
                .catch(error => {
                    console.error(error);
                });

            })
            .catch(error => {
                console.error(error);
            });

        })
        .catch(error => {
            // Handle errors if the promise is rejected
            console.error("Error occurred:", error);
        });


    })
    .catch(error => {
        console.error(error);
    });
});


server.get('/modifyLab', function(req, resp){
    responder.getLabById(curLabId)
    .then(curLab => {
        responder.getTimeslots(curLab, getCurrentDate())
        .then(dateData => {
            resp.render('modifyLab', {
                layout: 'modifyLabIndex',
                title: 'Modify Laboratory',
                date: getCurrentDate(),
                timeFrame: dateData
            });
        })
        .catch(error => {
            console.error(error);
        });
    })
    .catch(error => {
        console.error(error);
    });


});


server.post('/changeModifyLab', function(req, resp){
    responder.getLabById(curLabId)
    .then(curLab => {
        responder.getTimeslots(curLab, req.body.date)
        .then(dateData => {
            resp.send({dateData: dateData});
        })
        .catch(error => {
            console.error(error);
        });
    })
    .catch(error => {
        console.error(error);
    });
});
// ADD NEW LINES BELOW HERE

function getCurrentDate(){
    //date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    return date;
}


function sortByStartTime(array) {
    return array.sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.timeStart}`);
        const timeB = new Date(`1970-01-01T${b.timeStart}`);
        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;
        return 0;
    });
}


server.post('/save-profile', function(req, resp){

    responder.updateProfile(curUserData.email, req.body.username, req.body.password, req.body.bio)
    .then(whatever => {

        responder.getUserByEmail(curUserData.email)
        .then(user => {
            curUserData = user;
            resp.redirect('/profile')
        })
        .catch(error => {
            console.error(error);
        });


    })
    .catch(error => {
        console.error(error);
    });

});

server.post('/searchFunction', function (req, resp) {
    const searchString = req.body.stringInput;
    searchQuery = searchString;
    responder.roomSearch(searchString)
        .then(searchQueryResults => {
            let seenLabs = [];
            for (let i = 0; i < 3 && i < searchQueryResults.length; i++) {
                seenLabs.push(searchQueryResults[i]);
            }

            // Redirect to /mainMenu with query parameters
            resp.redirect('/mainMenu?labs=' + encodeURIComponent(JSON.stringify(seenLabs)));

        })
        .catch(error => {
            // Handle errors if needed
            console.error(error);
            resp.status(500).send('Internal Server Error');
        });
});

server.get('/editReservation', function (req, resp) {
    responder.getLabByName(req.query.roomNum)
    .then(lab => {
        resp.redirect('/labs/' + lab._id);            
    })
    .catch(error => {
        console.error(error);
    });
});


/************************no need to edit past this point********************************* */
}

module.exports.add = add;