function confirmDelProf(msg, myYes) {
	alert("To be implemented in Phase 3.");
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
	alert("To be implemented in Phase 3.");
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