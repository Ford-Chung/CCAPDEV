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

  $(".cancel").click(function(){
    //get the needed values
    var selectedOption = $("#timeSelect").find("option:selected").val();
    var selectedDate = $('#date-input').val();
    

    $.post('../removeReservation', {room: room, seat: id, date: selectedDate, timeFrame: selectedOption}, 
    function(data, status){
      if(status==='success'){
        $('#'+id).removeClass('reserved');
        overlay.classList.remove('active');
        $(idA).hide();
      }
    });


    $.post('../getTimeFrames', {date: selectedDate},
    function(data, status){
      if(status ==='success'){
        let dateopt = '';
        var selectedTime = $("#timeSelect").find("option:selected").val();
        console.log(data.dateData);
    
        for(let i = 0; i < data.dateData.length; i++){
          if(selectedTime == data.dateData[i].timeStart + "-" + data.dateData[i].timeEnd){
            dateopt += "<option value="+ data.dateData[i].timeStart + "-" + data.dateData[i].timeEnd + ">" + data.dateData[i].timeStart + " - " + data.dateData[i].timeEnd + " :: Available: " + (data.dateData[i].available) + "</option>";

          }else{
            dateopt += "<option value="+ data.dateData[i].timeStart + "-" + data.dateData[i].timeEnd + ">" + data.dateData[i].timeStart + " - " + data.dateData[i].timeEnd + " :: Available: " + data.dateData[i].available + "</option>";
          }
        }
        $("#timeSelect").html(dateopt);
        $("#timeSelect").val(selectedTime);
      }
    });
  });



  $("#reserve").click(function(){
    var selectedOption = $("#timeSelect").find("option:selected").val();
    let res = document.getElementById("anon").checked;
    var selectedDate = $('#date-input').val();
    $.post('../reserve', {room: room, seat: id, anon: res, date: selectedDate, timeFrame: selectedOption}, 
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
    

    $.post('../getTimeFrames', {date: selectedDate},
    function(data, status){
      if(status ==='success'){
        let dateopt = '';
        var selectedTime = $("#timeSelect").find("option:selected").val();
        console.log(data.dateData);
    
        for(let i = 0; i < data.dateData.length; i++){
          if(selectedTime == data.dateData[i].timeStart + "-" + data.dateData[i].timeEnd){
            dateopt += "<option value="+ data.dateData[i].timeStart + "-" + data.dateData[i].timeEnd + ">" + data.dateData[i].timeStart + " - " + data.dateData[i].timeEnd + " :: Available: " + (data.dateData[i].available - 1) + "</option>";

          }else{
            dateopt += "<option value="+ data.dateData[i].timeStart + "-" + data.dateData[i].timeEnd + ">" + data.dateData[i].timeStart + " - " + data.dateData[i].timeEnd + " :: Available: " + data.dateData[i].available + "</option>";
          }
        }
        $("#timeSelect").html(dateopt);
        $("#timeSelect").val(selectedTime);
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

        $.post('/modal', {seat: "C"+i+"S" + j, roomNum: room, date: selectedDate, timeFrame: selectedOption}, function(data, status){
          if(status==="success"){
            
            //modal type
            idA = "#modal"+data.modal;

            modal = document.querySelector(idA);
                              
            $(idA).show();
            
            let overlay = document.getElementById("overlay");
            overlay.classList.add('active');

            const title = modal.querySelector('.modal-header #title');
            const datePlaceholder = modal.querySelector('.content .date');
            datePlaceholder.textContent = "Date: " + selectedDate; 
            const timePlaceholder = modal.querySelector('.content .time');
            timePlaceholder.textContent = "Time: " + selectedOption; 
            

            if(data.modal != 'A' && (data.modal == 'D' || data.modal == 'B')){
                const name = modal.querySelector('.content #reserver-name');
                name.textContent = data.name;
                name.href =  `/public-profile/` + data.user['_id'];
            }

            if(data.modal == 'F'){
              const name = modal.querySelector('.content #reserver-name');
              name.textContent = data.name;
            }

            if(data.modal == 'E'){
              const name = modal.querySelector('.content .name-placeholder');
              name.textContent = "Reserver Name: Anonymous ( " + data.name + " )";
              name.href =  `/public-profile/` + data.user['_id'];
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