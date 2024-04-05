$(document).ready(function(){
    $(".searchFilterContainer").click(function(){
        $(".searchFilterContainer").removeClass("selected");
        $(this).addClass("selected");
    });

    $("#people").click(function(){
        // Replace content of .flexParent with the new structure for peopleContainer
        $(".laboratoryContainer").hide();
        $(".flexParent").html(`
         <div class="profileContainer" onclick="window.location.href = '../Profile/profilePublic.html'">

                <div class="heading">
                    <div class="profilePicture">
                        <img src="../Image/amogus.png">
                    </div>
                    <h1> Alex Chang </h1>
                </div>
                <div class="profileDetails">
                    <h2> Hey there, I'm Alex Chang, and I'm all about exploring the intersection of technology and creativity. Growing up in Silicon Valley, I was surrounded by innovation and opportunity, sparking my curiosity about how technology can shape our world. </h2>
                </div>
            </div>

            <div class="profileContainer" onclick="window.location.href = '../Profile/profile.html'">
                <div class="heading">
                    <div class="profilePicture">
                        <img src="../Image/amogus.png">
                    </div>
                    <h1> Maya Rodriguez </h1>
                </div>
                <div class="profileDetails">
                    <h2> I'm Maya Rodriguez, and my passion lies in protecting our environment and the incredible creatures that call it home. Growing up in Costa Rica, I was fortunate to be surrounded by breathtaking nature, from dense rainforests to stunning beaches. These experiences ignited a fire within me to dedicate my life to conservation efforts. </h2>
                </div>
            </div>

            <div class="profileContainer" onclick="window.location.href = '../Profile/profilePublic2.html'">
                <div class="heading">
                    <div class="profilePicture">
                        <img src="../Image/amogus.png">
                    </div>                
                    <h1> Sarah Patel </h1>
                </div>
                <div class="profileDetails">
                    <h2> Hi, I'm Sarah Patel, and I'm passionate about harnessing the power of education to drive positive change in the world. Growing up in a small town in India, I experienced firsthand the transformative impact of learning and community support. </h2>
                </div>
            </div>

            <div class="profileContainer" onclick="window.location.href = '../Profile/profilePublic3.html'">
                <div class="heading">
                    <div class="profilePicture">
                        <img src="../Image/amogus.png">
                    </div>           
                    <h1> Ryan Thompson </h1>
                </div>
                <div class="profileDetails">
                    <h2>Hey, I'm Ryan Thompson, and my passion lies in exploring the intersection of art and technology. Growing up in a family of artists and engineers, I was exposed to a unique blend of creativity and innovation from an early age.</h2>
                </div>
            </div>

            <div class="profileContainer" onclick="window.location.href = '../Profile/profilePublic4.html'">
                <div class="heading">
                    <div class="profilePicture">
                        <img src="../Image/amogus.png">
                    </div>           
                    <h1> Marcus Lee </h1>
                </div>
                <div class="profileDetails">
                    <h2> Hey, I'm Marcus Lee, and I'm on a mission to blend my passion for adventure with my love for sustainable living. Growing up in the mountains of Colorado, I developed a deep appreciation for the great outdoors and the importance of preserving our natural environment. </h2>
                </div>
            </div>
        
        `);
    });

    $("#room").click(function(){
        location.reload();
    });


});

