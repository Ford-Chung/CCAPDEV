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
                  const button = event.target.closest('button[data-modal-target]');
                  const modalId = button.getAttribute('data-modal-target');
                  const modal = document.querySelector(modalId);
                  room = $("#roomNum").text();
                  idA = modalId;
                  $(modalId).show();

                  const title = modal.querySelector('.modal-header #title');

                  id = button.getAttribute('id');

                  if (title) {
                    title.textContent = id; 
                  }




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
    $.post('../reserve', {room: room, seat: id}, 
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




});