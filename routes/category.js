var Firebase = require("firebase");
var processData = require('./processData.js');
// var eventRef = new Firebase("https://event-finder.firebaseio.com/events");
var eventRef = new Firebase("https://event-finder-test.firebaseio.com/events");

function getCategoryData(res, start, length, category) {
	console.log("getting category: " + category);
	eventRef.orderByChild("primaryTag").equalTo(category).limitToFirst(length).once("value", function(snapshot) {
		var result = {
			"result": []
		};
		snapshot.forEach(function(data) {
        	result["result"].push(processData.processSearchListData(data));
      	});
      	result["title"] = category;
		res.render('searchlist', result);
		return;
	});
}

function getCategoryDataWithSecondary(res, start, length, category) {
	eventRef.limitToFirst(length).once("value", function(snapshot) {
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
		        	result["result"].push(processData.processSearchListData(data));
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
	getCategoryData(res, 0, 10, "Athletics");
};

exports.viewFreeFood = function(req, res){
	getCategoryDataWithSecondary(res, 0, 10, "Free Food");
};

exports.viewCornellSponsored = function(req, res){
	getCategoryDataWithSecondary(res, 0, 10, "Cornell Sponsored");
};




