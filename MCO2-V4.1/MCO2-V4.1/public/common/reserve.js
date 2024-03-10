$(document).ready(function(){
  let idA;
  const overlay = document.getElementById('overlay');
  var id;
  var room;
  
  //initiate click actions 
  $.post('/labdetails', {roomNum: $(roomNum).text()}, 
        function(data, status){
          if(status==='success'){
            for(let i = 1; i <= data.lab.numCols; i++){
              for(let j = 1; j <= data.lab.seats; j++){
                $("#C"+i+"S"+j).click(function(){

                  //current room
                  room = $("#roomNum").text();
                  let modal;
                  id = "C"+i+"S"+j;

                  $.post('/modal', {seat: "C"+i+"S" + j, roomNum: room}, function(data, status){
                    if(status==="success"){
                      
                      //modal type
                      idA = "#modal"+data.modal;

                      modal = document.querySelector(idA);
                      console.log(modal);

                                        
                      $(idA).show();

                      const title = modal.querySelector('.modal-header #title');
                      
                      
                      

                      if(data.modal != 'A' && (data.modal == 'D' || data.modal == 'B')){
                          const name = modal.querySelector('.content #reserver-name');
                          name.textContent = data.name;
                      }

                      if(data.modal == 'E'){
                        const name = modal.querySelector('.content .name-placeholder');
                        name.textContent = "Reserver Name: Anonymous ( " + data.name + " )";
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
        }
  );

  $(".close-button").click(function(){
    $(idA).hide();
  });

  $("#reserve").click(function(){
    let res = document.getElementById("anon").checked;

    $.post('../reserve', {room: room, seat: id, anon: res}, 
    function(data, status){
      if(status === 'success'){
        if(data.status === "reserved"){
          let block = document.getElementById(id);
  
          block.classList.add('reserved');
          $(idA).hide();
        }
      }
    });
    
  });


  function process(){
    let res = document.getElementById("anon").checked;
    
    if(res){
      document.getElementById(idA).classList.add("anon");
    }
  }

});