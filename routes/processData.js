var timeprocessing = require('./timeprocessing.js');

function getCategoryImgName(type) {
    switch(type) {
        case "Professional Events": 
            return "Professional";
        case "Social Events":
            return "Social";
        case "Political Events":
            return "Political";
        case "Performance Events":
            return "Performance";
        case "Seminars":
            return "Seminars";
        case "Athletics":
            return "Athletics";
    }
    return "NOTFOUND";
}

function getCategoryColor(type) {
    switch(type) {
        case "Professional Events": 
            return "#7AAFEE";  // light blue
        case "Social Events":
            return "#F2DE8D";  // light orange
        case "Political Events":
            return "#FFFF78";  // light yellow
        case "Performance Events":
            return "#C477EE";  // light puple
        case "Seminars":
            return "#73F573";  // light green 
        case "Athletics":
            return "#EF4343";  // light red
    }
    return "NOTFOUND";
}

exports.processSearchListData = function(data) {
    url_max_possible_length = 1000
    var tmp = {
        "id": data.key(),
        "startingTime": timeprocessing.numberToText(data.val().startingTime),
        "endingTime": timeprocessing.numberToText(data.val().endingTime),
        "title": data.val().nameOfEvent,
        "location": data.val().locationOfEvent,
        "category": getCategoryImgName(data.val().primaryTag),
        "categoryColor": getCategoryColor(data.val().primaryTag),
        "description": data.val().introOfEvent,
        "numberOfViewed": data.val().numberOfViewed,
        "url": "/details/" + data.key()
      };
      url_max_possible_length = 1000
      if (data.val().imageOfEvent != null) {
        if (data.val().imageOfEvent[0].length < url_max_possible_length) {
            console.log(data.val().imageOfEvent[0]);
            tmp["img"] = data.val().imageOfEvent[0];
        }
        else 
            tmp["img"] = "data:image/png;base64," + data.val().imageOfEvent[0];
      }
      else
        tmp["img"] = '/img/category/' + getCategoryImgName(data.val().primaryTag) + ".jpg";
      return tmp;

 }