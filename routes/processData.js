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

exports.processSearchListData = function(data) {
    var tmp = {
        "id": data.key(),
        "startingTime": timeprocessing.numberToText(data.val().startingTime),
        "endingTime": timeprocessing.numberToText(data.val().endingTime),
        "title": data.val().nameOfEvent,
        "location": data.val().locationOfEvent
      };
      if (data.val().imageOfEvent != null) 
        tmp["img"] = "data:image/png;base64," + data.val().imageOfEvent[0];
      else
        tmp["img"] = '/img/category/' + getCategoryImgName(data.val().primaryTag) + ".jpg";
      return tmp;

 }