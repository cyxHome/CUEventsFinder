var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://event-finder.firebaseio.com/");

exports.view = function(req, res){
	myFirebaseRef.child("events/Basketball%20Match").on("value", function(snapshot) {
	   var details = snapshot.val();
	});
  	res.render('details');
};
