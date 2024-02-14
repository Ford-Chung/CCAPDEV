function confirmDelProf(msg, myYes) {
	var confirmBox = $("#del-prof");
	confirmBox.find("#del-prof-msg").text(msg);
	confirmBox.find("#save-prof-btn").unbind().click(function() {
		confirmBox.hide();
	});
	confirmBox.find("#del-prof-btn").unbind().click(function() {
		confirmBox.hide();
	});
	confirmBox.find("#save-prof-btn").click(myYes);
	confirmBox.show();
}

 function confirmDelResv(msg, myYes) {
	var confirmBox = $("#del-resv");
	confirmBox.find("#del-resv-msg").text(msg);
	confirmBox.find("#save-resv-btn").unbind().click(function() {
	   confirmBox.hide();
	});
	confirmBox.find("#del-resv-btn").unbind().click(function() {
		confirmBox.hide();
	 });
	confirmBox.find("#save-resv-btn").click(myYes);
	confirmBox.show();
 }