// Get all of our popular data, category data and concat them to a single json object
var category = require('../data/category.json');
var Firebase = require("firebase");
var timeprocessing = require('./timeprocessing.js');
var ref = new Firebase("https://event-finder.firebaseio.com/events");

// get the 6 most viewed events from the databse 


function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}

exports.view = function(req, res){
	ref.orderByChild("numberOfViewed").limitToLast(6).once("value", function(snapshot) {
		var popularTmp = {
			"popular": []
		};
        var popular = {
            "popular": []
        }
		snapshot.forEach(function(data) {
        	var tmp = {
        		"id": data.key(),
        		"img": "data:image/png;base64," + data.val().imageOfEvent[0],
        		"startingTime": timeprocessing.numberToText(data.val().startingTime),
        		"endingTime": timeprocessing.numberToText(data.val().endingTime),
        		"title": data.val().nameOfEvent,
        		"location": data.val().locationOfEvent,
        		"description": data.val().introOfEvent,
                "numberOfViewed": data.val().numberOfViewed
        	};
            // put the most viewed element to the front
        	popularTmp["popular"].unshift(tmp);
            // console.log("time of View: " + data.val().numberOfViewed);
      	});
        // reverse the order
        // for (var i = popularTmp["popular"].length-1; i >=0 ; --i) {
        //     popular["popular"].push(popularTmp["popular"][i]);
        // }
		var data = {};
		data = jsonConcat(data, popularTmp);
		data = jsonConcat(data, category);
		res.render('index', data);
	});
};