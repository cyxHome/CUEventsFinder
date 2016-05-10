function clickOnCategory(type, primary) {

	console.log("Clicked on Category: " + type + ", primary: " + primary);

	/* http://stackoverflow.com/questions/1531093/how-to-get-current-date-in-javascript */
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;   //January is 0!
	var yyyy = today.getFullYear();

	var date = yyyy * 10000 + mm * 100 + dd;
	var lowerBound = date * 10000;
	var upperBound = date * 10000 + 9999;


	jumpToCategoryWithStartingTime(type, "True", upperBound, lowerBound);
}

// choose on a category with querying parameters
function jumpToCategoryWithStartingTime(type, primary, upperBound, lowerBound) {

	window.location.href = '/category/?type=' + type + '&primary=' + primary + '&from=' + lowerBound + '&to=' + upperBound; 

}

function jumpToCategoryOfDate(type, primary, date) {

	var lowerBound = parseInt(date) * 10000;
	var upperBound = parseInt(date) * 10000 + 9999;

	jumpToCategoryWithStartingTime(type, "True", upperBound, lowerBound);

}