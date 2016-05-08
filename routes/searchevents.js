var Firebase = require("firebase");
var processData = require('./processData.js');
// var ref = new Firebase("https://event-finder.firebaseio.com/events");
var ref = new Firebase("https://event-finder-test.firebaseio.com/events");

/**
 * Look up all events matching the keyword
 */
exports.lookupEventsByKeyword = function(req, res) { 
  var tokens = req.url.split("/");
  var keyword = tokens[tokens.length-1];

  console.log("server get input keyword: " + keyword);

  ref.orderByChild("startingTime").limitToFirst(10).once("value", function(snapshot) {
      var result = {
          "result": []
      }
      snapshot.forEach(function(data) {

        if (data.val().introOfEvent.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
            result["result"].push(processData.processSearchListData(data));
        }
      });
      result["title"] = "Events matching " + keyword;
      console.log("before reder to searchlist result");
      res.render('searchlist', result);
  });
}


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


exports.lookupUpcomingEvents = function(req, res) {
  // for real use
  ref.orderByChild("startingTime").startAt(getDate()).limitToFirst(10).once("value", function(snapshot) {
  // for demo
  // ref.orderByChild("startingTime").limitToFirst(10).once("value", function(snapshot) {
      var result = {
          "result": []
      }
      snapshot.forEach(function(data) {
          result["result"].push(processData.processSearchListData(data));
      });
      result["title"] = "Events";
      res.render('searchlist', result);
  });
}