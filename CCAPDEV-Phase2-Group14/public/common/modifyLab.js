$(document).ready(function(){
    $("#date").change(function() {
        const date =  $("#date").val();

        $.post('changeModifyLab', {date: date},
        function(data, status){
            if(status === 'success'){
                let options = '';
                for(let i = 0; i < data.dateData.length; i++){
                    options += '<option value="'+ data.dateData[i].timeStart + `-`+ data.dateData[i].timeEnd + `">` + data.dateData[i].timeStart + `-` + data.dateData[i].timeEnd + `</option>`;
                }
                $("#timeSelect").html(options);
            }



        });
    
    });
});