var ref = new Firebase("https://event-finder.firebaseio.com/events");
var usersRef = new Firebase("https://event-finder.firebaseio.com/users");


$(document).ready(function() {

	$('#datetimepicker1').datetimepicker();
	$('#datetimepicker2').datetimepicker();

	var primaryTag;


	$('#tag1').click(function(e) {
		e.preventDefault(); 
		var tag = document.getElementById('primary-tag');
		primaryTag = "Professional Events";
		tag.innerHTML = "<div class='selected-tag'>Professional Events</div>";
	});
	$('#tag2').click(function(e) {
		e.preventDefault(); 
		var tag = document.getElementById('primary-tag');
		primaryTag = "Social Events";
		tag.innerHTML = "<div class='selected-tag'>Social Events</div>";
	});
	$('#tag3').click(function(e) {
		e.preventDefault(); 
		var tag = document.getElementById('primary-tag');
		primaryTag = "Performance Events";
		tag.innerHTML = "<div class='selected-tag'>Performance Events</div>";
	});
	$('#tag4').click(function(e) {
		e.preventDefault(); 
		var tag = document.getElementById('primary-tag');
		primaryTag = "Political Events";
		tag.innerHTML = "<div class='selected-tag'>Political Events</div>";
	});
	$('#tag5').click(function(e) {
		e.preventDefault(); 
		var tag = document.getElementById('primary-tag');
		primaryTag = "Seminars";
		tag.innerHTML = "<div class='selected-tag'>Seminars</div>";
	});
	$('#tag6').click(function(e) {
		e.preventDefault(); 
		var tag = document.getElementById('primary-tag');
		primaryTag = "Athletics";
		tag.innerHTML = "<div class='selected-tag'>Athletics</div>";
	});

	$('#post-event').click(function(e) {
		e.preventDefault(); 
		var fileInput = document.getElementById('image');
		var file = fileInput.files[0];
		var title = $('#title').val();
		var starting = $('#starting').val();
		var ending = $('#ending').val();
		var location = $('#us2-address').val();
		var lat = $('#us2-lat').val();
		var lng = $('#us2-lon').val();
		var restriction = $('#restriction').val();
		var description = $('#description').val();
		var checkbox1 = $('#checkbox1').is(":checked");
		var checkbox2 = $('#checkbox2').is(":checked");
		var checkbox3 = $('#checkbox3').is(":checked");
		
		var imageType = /image.*/;
		var errorlog = document.getElementById('error-feedback');
		errorlog.innerHTML = "";

		/** 
		 * Process datatime info before store it into database
		 */
		function processDateTime(datetime) {
			var tokens = starting.split(" ");
			token1s = tokens[0].split("/");
			token2s = tokens[1].split(":");
			// parsing date
			var total = 0;
			total += parseInt(token1s[2]);
			total *= 100;
			total += parseInt(token1s[0]);
			total *= 100;
			total += parseInt(token1s[1]);
			// parsing time
			for (var i = 0; i < token2s.length; i++) {
				total *= 100;
				total += parseInt(token2s[i]);
			};
			// parsing AM/PM
			if (tokens[2] == "PM")
				total += 1200;
			return total;
		}

		/**
		 * Get current date and time
		 */
		 function getDateTime() {
		 	var d = new Date();
		 	var total = d.getFullYear();
		 	total *= 100;
		 	total += d.getMonth() + 1;  // January is 0
		 	total *= 100;
		 	total += d.getDate();
		 	total *= 100;
		 	total += d.getHours();
		 	total *= 100;
		 	total += d.getMinutes();
		 	return total;
		 }

		if (title.length == 0) {
			errorlog.innerHTML = "please specify the title of your event";
			return;
		}
		if (starting.length == 0) {
			errorlog.innerHTML = "please specify the starting time of your event";
			return;
		}
		if (ending.length == 0) {
			errorlog.innerHTML = "please specify the ending time of your event";
			return;
		}
		if (primaryTag == undefined) {
			errorlog.innerHTML = "please specify the Tag of your event";
			return;
		}
		if (description.length == 0) {
			errorlog.innerHTML = "please specify the description of your event";
			return;
		}

		var startingTime = processDateTime(starting);
		var endingTime = processDateTime(ending);
		var postTime = getDateTime();
		var currentAccount = getCookie("currentAccount");
		var secondaryTag = getSecondaryTag(checkbox1, checkbox2, checkbox3);
		

		var json = {
			"nameOfEvent": title,
			"startingTime": startingTime,
			"endingTime": endingTime,
			"postTime": postTime,
			"locationOfEvent": location,
			"latOfEvent": lat,
			"lngOfEvent": lng,
			"file": file,
			"introOfEvent": description,
			"authorName": currentAccount,
			"primaryTag": primaryTag,
			"secondaryTag": secondaryTag,
			"imageOfEvent": "",
			"authorProfileImg": "",
			"restriction": restriction
		};

		var url_call = '/event/post';


		if (file !== undefined) {
			var reader = new FileReader();

			reader.onload = function(e) {
				var imgTmp = reader.result;
				var n = imgTmp.indexOf(",");
				var imgData = imgTmp.substr(n+1);
				json["imageOfEvent"] = imgData;
				storeJsonFile(json, currentAccount);
			}

			reader.readAsDataURL(file);	
		}
		else {
			storeJsonFile(json, currentAccount);
		}

	});
});

function storeJsonFile(json, currentAccount) {
	usersRef.orderByChild("username").equalTo(currentAccount).once("value", function(snapshot) {
		snapshot.forEach(function(data) {
        	var authorProfileImg = data.val().usrProfileImage;
        	if (authorProfileImg !== undefined)
        		json["authorProfileImg"] = authorProfileImg;
			ref.push().set({
				nameOfEvent: json["nameOfEvent"],
				startingTime: json["startingTime"],
				endingTime: json["endingTime"],
				postTime: json["postTime"],
				locationOfEvent: json["locationOfEvent"],
				latOfEvent: json["latOfEvent"],
				lngOfEvent: json["lngOfEvent"],
				introOfEvent: json["introOfEvent"],
				authorName: json["authorName"],
				primaryTag: json["primaryTag"],
				secondaryTag: json["secondaryTag"],
				imageOfEvent: json["imageOfEvent"],
				authorProfileImg: json["authorProfileImg"],
				restriction: json["restriction"],
				numberOfViewed: 0
			}, function(error) {
				if (error) {
					console.log("Data could not be saved." + error);
				} else {
					console.log("Data has been saved.");
				}
			});
			return;
      	});
	});
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function getSecondaryTag(first, second, third) {
	var result = [];
	if (first)
		result.push("Cornell Sponsor");
	if (second)
		result.push("No Charge");
	if (third)
		result.push("Free Food");
	return result;
}