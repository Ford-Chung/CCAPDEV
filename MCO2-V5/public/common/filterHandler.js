$(document).ready(function(){
    $(".searchFilterContainer").click(function(){
        $(".searchFilterContainer").removeClass("selected");
        $(this).addClass("selected");
    });

    $("#people").click(function(){
        // Replace content of .flexParent with the new structure for peopleContainer


        $.post(
            /* Link sent to the server */
            'load-people',
            /* Input sent to the server */
            { input: 1 },
            /* Call-back function that processes the server response */
            function(data, status){
              if(status === 'success'){
                $('#stringInput').attr('placeholder', data.searchQuery);
                $(".laboratoryContainer").hide();
                $('.flexParent').empty();

                for (let i = 0 ; i < data.users.length; i++){
                    var textContent = $(`
                    <div class="profileContainer" onclick="window.location.href = '/public-profile/` + data.users[i]['_id'] +`'">
           
                           <div class="heading">
                               <div class="profilePicture">
                                   <img src="/images/pfps/` + data.users[i]['pfp'] +`">
                               </div>
                               <h1> ` + data.users[i]['username'] +` </h1>
                           </div>
                           <div class="profileDetails">
                               <h2> ` + data.users[i]['bio'] +` </h2>
                           </div>
                       </div>`);
                    $('.flexParent').append(textContent);
                }


              }//if
            });//fn+post




        
    });

    $("#room").click(function(){
        location.reload();
    });


});

