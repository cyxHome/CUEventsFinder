// Get all of our popular data, category data and concat them to a single json object
var category = require('../data/category.json');
var Firebase = require("firebase");
var processData = require('./processData.js');
var eventRef = new Firebase("https://event-finder.firebaseio.com/events");

// get the 6 most viewed events from the databse 


function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}

exports.view = function(req, res){
	eventRef.orderByChild("numberOfViewed").limitToLast(6).once("value", function(snapshot) {
		var popular = {
			"popular": []
		};
		snapshot.forEach(function(data) {
            var tmp = processData.processSearchListData(data);
            // put the most viewed element to the front
        	popular["popular"].unshift(tmp);
            // console.log("time of View: " + data.val().numberOfViewed);
      	});
		var data = {};
		data = jsonConcat(data, popular);
		data = jsonConcat(data, category);
		res.render('index', data);
	});
};