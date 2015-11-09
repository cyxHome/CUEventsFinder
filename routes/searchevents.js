var Firebase = require("firebase");
var ref = new Firebase("https://event-finder.firebaseio.com/events");


/**
 * Look up all events matching the keyword
 */
exports.lookupEventsByKeyworld = function(req, res) { 
  var keyword = req.body['keyword'];

  console.log("server get input keyword: " + keyword);

  ref.orderByChild("dateOfEvent").equalTo(accountName).once("value", function(snapshot) {
    if (snapshot.numChildren() == 0){
      console.log("didn't find such user")
      res.json("not-taken");
    }
    else {
      snapshot.forEach(function(data) {
        res.json(data.val().password);
      });
    }
  });
}
