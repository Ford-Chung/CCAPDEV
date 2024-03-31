$(document).ready(function(){
	$("#del-room-btn").click(function(myYes) {
		var confirmBox = $("#conf-del-room-div");
		confirmBox.find("#del-room-msg").text("Confirm delete room?");
		confirmBox.find("#cancel-btn").unbind().click(function() {
			confirmBox.hide();
		});
		confirmBox.find("#conf-del-room-btn").unbind().click(function() {
			alert("To be implemented in Phase 3.");
            confirmBox.hide();
		});
		confirmBox.find("#cancel-btn").click(myYes);
		confirmBox.show();
	});
});