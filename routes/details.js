var Firebase = require("firebase");
var eventsRef = new Firebase("https://event-finder.firebaseio.com/events");
var timeprocessing = require('./timeprocessing.js');

var toRender;

exports.view = function(req, res){
	console.log("comes to view details");
	res.render('details',toRender);
};

exports.viewIdAtUrl = function(req, res) {
    var tokens = req.url.split("/");
    var id = tokens[tokens.length-1];
    viewByID(id, res);
}

function viewByID(id, res) {
    eventsRef.orderByKey().equalTo(id).once("value", function(snapshot) {
        if (snapshot.child(id).val() == null)
            return;
        console.log("Key " + snapshot.child(id).key());
        console.log("value " + snapshot.child(id).val().nameOfEvent);
        data = snapshot.child(id);
        var newCount = 0;
        if (data.val().numberOfViewed != null) {
            newCount = data.val().numberOfViewed + 1;
        }
        eventsRef.child(id).update({
            "numberOfViewed": newCount
        });
        var img = [];
        var imageOfEvents = data.val().imageOfEvent;
        if (data.val().imageOfEvent[1] != null) {
            var tmp = {"count": 0, "url": "data:image/png;base64," + data.val().imageOfEvent[1], "class": "active"};
            img.push(tmp);
        }
        for (var i = 2; data.val().imageOfEvent[i] != null; ++i) {
            var tmp = {"count": i-1, "url": "data:image/png;base64," + data.val().imageOfEvent[i], "class": ""};
            img.push(tmp);
        }
        var tmp = {
            "time": timeprocessing.numberToText(data.val().startingTime) + "-" + timeprocessing.numberToText(data.val().endingTime),
            "title": data.val().nameOfEvent,
            "location": data.val().locationOfEvent,
            "lat": data.val().latOfEvent,
            "lng": data.val().lngOfEvent,
            "details": data.val().introOfEvent,
            "pritag": data.val().primaryTag,
            "sectags": data.val().secondaryTag,
        };
        if (data.val().imageOfEvent[0] != null) {
            tmp["pri-img"] = "data:image/png;base64," + data.val().imageOfEvent[0];
        }
        if (img.length > 0) {
            tmp['img'] = img;
            console.log(tmp['img'].length);
        }
        else {
            tmp['hidden'] = "invisible zerosize";
        }
        toRender = tmp;
        res.render('details', tmp);
    });
}

exports.get = function(req, res) {
    console.log("start storing details info into details.js");
	var id = req.body['id'];
  	viewByID(id, res);
}
