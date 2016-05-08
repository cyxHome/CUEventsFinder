var Firebase = require("firebase");
var processData = require('./processData.js');
// var eventRef = new Firebase("https://event-finder.firebaseio.com/events");
var eventRef = new Firebase("https://event-finder-test.firebaseio.com/events");


/*

 * GET map page. 
 */

/**
* Get current date and time
*/
function getDate() {
	var d = new Date();
	var total = d.getFullYear();
	total *= 100;
	total += d.getMonth() + 1;  // January is 0
	total *= 100;
	total += d.getDate();
	total *= 100;
	total *= 100;
	return total;
}
var currentDateStarting = getDate();
var currentDateEnding = getDate() + 9999;

exports.view = function(req, res){
	// for real use
	eventRef.orderByChild("startingTime").startAt(currentDateStarting).endAt(currentDateEnding).once("value", function(snapshot) {
	// for demo
	// eventRef.orderByChild("startingTime").once("value", function(snapshot) {
		var current = {
			"current": []
		};
		snapshot.forEach(function(data) {
			// shorten the time 
            var tmp = processData.processSearchListData(data);
            tmp["startingTime"] = tmp["startingTime"].substring(11);
            tmp["endingTime"] = tmp["endingTime"].substring(11);
            current["current"].push(tmp);
      	});
		res.render('map', current);
	});
};