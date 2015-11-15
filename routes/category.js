var Firebase = require("firebase");
var timeprocessing = require('./timeprocessing.js');
var ref = new Firebase("https://event-finder.firebaseio.com/events");

function getCategoryData(res, start, length, category) {
	console.log("getting category: " + category);
	ref.orderByChild("primaryTag").equalTo(category).limitToFirst(length).once("value", function(snapshot) {
		var result = {
			"result": []
		};
		snapshot.forEach(function(data) {
        	var tmp = {
        		"id": data.key(),
        		"startingTime": timeprocessing.numberToText(data.val().startingTime),
        		"endingTime": timeprocessing.numberToText(data.val().endingTime),
        		"title": data.val().nameOfEvent,
        		"location": data.val().locationOfEvent
        	};
        	if (data.val().imageOfEvent[0] != null) {
        		tmp["img"] = "data:image/png;base64," + data.val().imageOfEvent[0];
        	}
        	result["result"].push(tmp);


      	});
      	result["title"] = category;
		res.render('searchlist', result);
		return;
	});
}

function getCategoryDataWithSecondary(res, start, length, category) {
	ref.limitToFirst(length).once("value", function(snapshot) {
		var result = {
			"result": []
		};
		snapshot.forEach(function(data) {
			var match = false;
			if (data.val().secondaryTag != null) {
				for (var i = 0; data.val().secondaryTag[i] != null; ++i) {
					console.log("testing: " + data.val().secondaryTag[i] );
					if (data.val().secondaryTag[i] === category) {
						match = true;
						break;
					}
				}

				if (match) {
		        	var tmp = {
		        		"id": data.key(),
		        		"startingTime": timeprocessing.numberToText(data.val().startingTime),
		        		"endingTime": timeprocessing.numberToText(data.val().endingTime),
		        		"title": data.val().nameOfEvent,
		        		"location": data.val().locationOfEvent
		        	};
		        	if (data.val().imageOfEvent[0] != null) {
		        		tmp["img"] = "data:image/png;base64," + data.val().imageOfEvent[0];
		        	}
		        	result["result"].push(tmp);
				} 
			}
      	});
      	result["title"] = category;
		res.render('searchlist', result);
		return;
	});
}


exports.viewProfessional = function(req, res){
	getCategoryData(res, 0, 10, "Professional Events");
};

exports.viewSocial = function(req, res){
	getCategoryData(res, 0, 10, "Social Events");
};

exports.viewPerformance = function(req, res){
	getCategoryData(res, 0, 10, "Performance Events");
};


exports.viewPolitical = function(req, res){
	getCategoryData(res, 0, 10, "Political Events");
};


exports.viewSeminars = function(req, res){
	getCategoryData(res, 0, 10, "Seminars");
};

exports.viewAthletics = function(req, res){
	getCategoryData(res, 0, 10, "Althetics");
};

exports.viewFreeFood = function(req, res){
	getCategoryDataWithSecondary(res, 0, 10, "Free Food");
};

exports.viewCornellSponsored = function(req, res){
	getCategoryDataWithSecondary(res, 0, 10, "Cornell Sponsored");
};




