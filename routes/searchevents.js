var Firebase = require("firebase");
var timeprocessing = require('./timeprocessing.js');
var ref = new Firebase("https://event-finder.firebaseio.com/events");


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
  ref.orderByChild("startingTime").startAt(getDate()).limitToFirst(10).once("value", function(snapshot) {

      var result = {
          "result": []
      }
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
      result["title"] = "Events";
      res.render('searchlist', result);
  });
}