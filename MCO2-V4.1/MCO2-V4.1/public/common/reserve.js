$(document).ready(function(){
  console.log($("#roomNum").text());
  $.post('/labdetails', {roomNum: $(roomNum).text()}, 
        function(data, status){
          if(status==='success'){
            
          }
        });
});