var Firebase = require("firebase");
var ref = new Firebase("https://event-finder.firebaseio.com/events");

function processDateTime(time) {
	var minutes = time % 100;
	var result = ("0" + minutes).slice(-2);
	time /= 100;
	var hours = time % 100;
	if (hours > 12) {
		result += "PM";
		hours -= 12;
	}
	else {
		result += "AM"
	}
	hours = ("0" + hours).slice(-2);
	result = hours + ":" + result;
	time /= 100;
	var days = processMonthDay(time % 100);
	time /= 100;
	var months = processMonthDay(time % 100);
	time /= 100;
	var years = time % 10000;
	result = months + "/" + days + "/" + (""+years).slice(0,4) + " " + result;
	console.log("process date time result: " + result);
	return result;
}

function processMonthDay(input) {
	var tmp = (""+input).split(".");
	return ("0" + tmp[0]).slice(-2);
}

function getCategoryData(res, start, length, category) {
	console.log("getting category: " + category);
	ref.orderByChild("primaryTag").equalTo(category).limitToFirst(length).once("value", function(snapshot) {
		var result = {
			"result": []
		};
		snapshot.forEach(function(data) {
        	var tmp = {
        		"img": "data:image/png;base64," + data.val().imageOfEvent,
        		"startingTime": processDateTime(data.val().startingTime),
        		"endingTime": processDateTime(data.val().endingTime),
        		"title": data.val().nameOfEvent,
        		"location": data.val().locationOfEvent
        	};
        	result["result"].push(tmp);

      	});
  	    console.log(result);
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