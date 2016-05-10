var Firebase = require("firebase");
var processData = require('./processData.js');
// var eventRef = new Firebase("https://event-finder.firebaseio.com/events");
var eventRef = new Firebase("https://event-finder-test.firebaseio.com/events");

function getCategoryData(res, startingTimeUpperBound, startingTimeLowerBound, category) {
	console.log("getting startingTimeUpperBound: " + startingTimeLowerBound);
	console.log("typeof startingTimeUpperBound: " + typeof startingTimeLowerBound );
	eventRef.orderByChild("startingTime").startAt(startingTimeLowerBound).endAt(startingTimeUpperBound).once("value", function(snapshot) {
		var result = {
			"result": []
		};
		snapshot.forEach(function(data) {
			console.log(data);
			if (category === "All Events" || data.val().primaryTag === category) {
				result["result"].push(processData.processSearchListData(data));
			}
      	});
      	result["category"] = category;
      	result["previousDate"] = startingTimeUpperBound / 10000 - 1;
      	result["nextDate"] = startingTimeUpperBound / 10000 + 1;
      	result["title"] = category;
      	result["date"] = " on " + extractDateInformationFromTimeString(startingTimeUpperBound);
		res.render('searchlist', result);
		return;
	});
}

function extractDateInformationFromTimeString(time) {
	var yyyy = time.toString().substring(0, 4);
	var mm = time.toString().substring(4, 6);
	var dd = time.toString().substring(6, 8);
	return mm + "/" + dd + "/" + yyyy;
}

function getCategoryDataWithSecondary(res, startingTimeUpperBound, startingTimeLowerBound, category) {
	eventRef.orderByChild("startingTime").startAt(startingTimeLowerBound).endAt(startingTimeUpperBound).once("value", function(snapshot) {
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
      	result["category"] = category;
      	result["previousDate"] = startingTimeUpperBound / 10000 - 1;
      	result["nextDate"] = startingTimeUpperBound / 10000 + 1;
      	result["title"] = category;
      	result["date"] = " on " + extractDateInformationFromTimeString(startingTimeUpperBound);
		res.render('searchlist', result);
		return;
	});
}


exports.viewCategory = function(req, res){
	var type = req.param("type")
	var primaryTag = req.param("primary")
	var upperBound = req.param("to")
	var lowerBound = req.param("from")
	if (primaryTag === "True") {
		getCategoryData(res, parseInt(upperBound), parseInt(lowerBound), type);
	}
	else {
		getCategoryDataWithSecondary(res, parseInt(upperBound), parseInt(lowerBound), type);
	}
};




