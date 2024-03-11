$(document).ready(function(){
  let idA;
  const overlay = document.getElementById('overlay');
  var id;
  var room;
  
  //initiate click actions 
  $.post('/labdetails', {roomNum: $(roomNum).text()}, 
        function(data, status){
          if(status==='success'){
            loadClicks(data.lab.numCols, data.lab.seats);
          }
        }
  );

  $(".close-button").click(function(){
    let overlay = document.getElementById("overlay");
    overlay.classList.remove('active');
    $(idA).hide();
  });

  $(".close").click(function(){
    let overlay = document.getElementById("overlay");
    overlay.classList.remove('active');
    $(idA).hide();
  });

  $("cancel").click(function(){
    let overlay = document.getElementById("overlay");
    overlay.classList.remove('active');
    $(idA).hide();
  });



  $("#reserve").click(function(){
    //get time and date selected
    var selectedOption = $("#timeSelect").find("option:selected").val();
    let res = document.getElementById("anon").checked;
    var selectedDate = $('#date-input').val();

    //get name and email of the walkin student
    var name = $("#reserved-name").val();
    var email = $("#reserved-email").val();

    if (name.trim() === '' || email.trim() === '') {
      alert('Name and Email fields are required!');
      return;
  }

    $.post('../reserve', {room: room, seat: id, anon: res, date: selectedDate, timeFrame: selectedOption, email, name}, 
    function(data, status){
      if(status === 'success'){
        if(data.status === "reserved"){
          let block = document.getElementById(id);
  
          block.classList.add('reserved');
          $(idA).hide();
          let overlay = document.getElementById("overlay");
          overlay.classList.remove('active');
        }
      }
    });
    
  });


  $("#overlay").click(function(){
    $(idA).hide();
    let overlay = document.getElementById("overlay");
    overlay.classList.remove('active');
  });


  $('#date-input').change(function() {
    updateValues(1);
  });


$("#timeSelect").change(function() {
  updateValues(2);
});

function updateValues(call){
  var selectedDate = $("#date-input").val();
  var selectedOption = $("#timeSelect").find("option:selected").val();

  console.log(selectedOption);

  $.post('../dateChange', {date: selectedDate, timeFrame: selectedOption, changed: call}, function(data, status){
    if(status === 'success'){
      let templateHTML;
      let templateDate;

      let slots = '';
      let dateopt = '';

      
    
      for(let i = 0; i < data.dateData.length; i++){
        dateopt += "<option value="+ data.dateData[i].timeStart + "-" + data.dateData[i].timeEnd + ">" + data.dateData[i].timeStart + " - " + data.dateData[i].timeEnd + " :: Available: " + data.dateData[i].available + "</option>";
      }

      $("#timeSelect").html(dateopt);

      if(call == 2){
        $("#timeSelect").val(selectedOption);
      }



      //insert the data in the timeslot
      for(let i = 1; i <= data.lab.numCols; i++){
        templateHTML = `<div class="column" id="C`+i+`">`;
        for(let j = 1; j <= parseInt(data.lab.seats); j++){

          if( (data.reserved).includes("C"+i+"S"+j)){
            templateHTML +=  `<button class="row reserved" id="C`+i+`S`+j+`">C`+i+`S`+j+`</button>`;
          }else{
            templateHTML += `<button class="row" id="C`+i+`S`+j+`">C`+i+`S`+j+`</button>`;
          }
            
        }

        templateHTML += "</div>";
        slots += templateHTML;
        
      }

      if(data.dateData.length != 0){
        $(".room-container").html(slots);
      }else{
        $(".room-container").html('');
      }
      

      loadClicks(data.lab.numCols, data.lab.seats);
      

    }
  })
}


function loadClicks(cols, seats){
  for(let i = 1; i <= cols; i++){
    for(let j = 1; j <= seats; j++){
      $("#C"+i+"S"+j).click(function(){
        var selectedDate = $('#date-input').val();

        var selectedOption = $("#timeSelect").find("option:selected").val();
        //current room
        room = $("#roomNum").text();
        let modal;
        id = "C"+i+"S"+j;

        $.post('/modalTech', {seat: "C"+i+"S" + j, roomNum: room, date: selectedDate, timeFrame: selectedOption}, function(data, status){
          if(status==="success"){
            let modalType = 'A';
            //modal type
            if(data.modal == 'C' || data.modal == 'B'){
              modalType = 'B';
            }
            if(data.modal == 'E' || data.modal == 'D'){
              modalType = 'C';
            }
            idA = "#modal"+modalType;

            modal = document.querySelector(idA);
                              
            $(idA).show();
            
            let overlay = document.getElementById("overlay");
            overlay.classList.add('active');

            const title = modal.querySelector('.modal-header #title');
            const datePlaceholder = modal.querySelector('.content .date');
            datePlaceholder.textContent = "Date: " + selectedDate; 
            const timePlaceholder = modal.querySelector('.content .time');
            timePlaceholder.textContent = "Time: " + selectedOption; 
            

            if(modalType == 'B'){
                const name = modal.querySelector('.content #reserver-name');
                name.textContent = data.name;
                name.href =  `/public-profile/` + data.user['_id'];
            }

            if(modalType=='C'){
              const name = modal.querySelector('.content #reserver-name');
              if(data.modal == 'E'){
                name.textContent = "Anonymous"
              }else{
                name.textContent = data.name;
              }
              
            }

            if (title) {
              title.textContent = "C"+i+"S" + j; 
            }


          }
        });
      })
    }
  }
}


});