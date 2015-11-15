// a module used to process the time 

// change the number representation of time in the database to the text representation 
// of time used in the view display 
exports.numberToText = function(time) {
	var minutes = time % 100;
	var result = ("0" + minutes).slice(-2);
	time /= 100;
	var hours = Math.floor(time % 100);
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
	var days = dealWithOneDigit(time % 100);
	time /= 100;
	var months = dealWithOneDigit(time % 100);
	time /= 100;
	var years = time % 10000;
	result = months + "/" + days + "/" + (""+years).slice(0,4) + " " + result;
	return result;
}

// sub-routine to deal with one digit number when processing month and date
function dealWithOneDigit(input) {
	var tmp = (""+input).split(".");
	return ("0" + tmp[0]).slice(-2);
}
