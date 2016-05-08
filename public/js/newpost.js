// var eventRef = new Firebase("https://event-finder.firebaseio.com/events");
var eventRef = new Firebase("https://event-finder-test.firebaseio.com/events");
// var usersRef = new Firebase("https://event-finder.firebaseio.com/users");
var usersRef = new Firebase("https://event-finder-test.firebaseio.com/users");

// create a good ramdom number as the name for the file
function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function get_signed_request(file, json, currentAccount){
    var xhr = new XMLHttpRequest();
    // obtain a signed PUT request for the file
    var name = guid()
    // console.log("/sign_s3?file_name="+name+"."+file.type.split('/').pop()+"&file_type="+file.type)
    xhr.open("GET", "/sign_s3?file_name="+name+"."+file.type.split('/').pop()+"&file_type="+file.type);
    // xhr.open("GET", "/sign_s3?file_name="+name)
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                upload_file(file, response.signed_request, response.url, json, currentAccount);
            }
            else{
                alert("Could not get signed URL.");
            }
        }
    };
    xhr.send();
}


function upload_file(file, signed_request, url, json, currentAccount){
	console.log("signed_request")
	console.log(signed_request)
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function() {
        if (xhr.status === 200) {
        	// alert("uploaded file " + url);
        	json["imageOfEvent"].push(url);
        	storeJsonFile(json, currentAccount);
        }
    };
    xhr.onerror = function() {
        alert("Could not upload file.");
    };
    xhr.send(file);
}

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
		var title = $('#title').val();
		var starting = $('#starting').val();
		var ending = $('#ending').val();
		console.log("starting input: "+starting);
		console.log("ending input: "+ending);
		var location = $('#us2-address').val();
		var lat = Number($('#us2-lat').val());
		var lng = Number($('#us2-lon').val());
		var restriction = $('#restriction').val();
		var description = $('#description').val();
		var checkbox1 = $('#checkbox1').is(":checked");
		var checkbox2 = $('#checkbox2').is(":checked");
		var checkbox3 = $('#checkbox3').is(":checked");
		
		var imageType = /image.*/;
		var errorlog = document.getElementById('error-feedback');
		errorlog.innerHTML = "";

		// change the represenation of time from string input into number 
		// before storing it into database 
		function inputToNumber(datetime) {
			var tokens = datetime.split(" ");
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
		if (restriction.length == 0) {
			restriction = "N/A";
		}

		var startingTime = inputToNumber(starting);
		var endingTime = inputToNumber(ending);
		console.log("input to number starting" + startingTime);
		console.log("input to number ending" + endingTime);
		var postTime = getDateTime();
		var currentAccount = getCookie("currentAccount");
		var secondaryTag = getSecondaryTag(checkbox1, checkbox2, checkbox3);
		
		if (endingTime < startingTime) {
			errorlog.innerHTML = "the ending time shouldn't be earlier than the starting time";
			return;
		}

		var json = {
			"nameOfEvent": title,
			"startingTime": startingTime,
			"endingTime": endingTime,
			"postTime": postTime,
			"locationOfEvent": location,
			"latOfEvent": lat,
			"lngOfEvent": lng,
			"introOfEvent": description,
			"authorName": currentAccount,
			"primaryTag": primaryTag,
			"secondaryTag": secondaryTag,
			"imageOfEvent": [],
			"authorProfileImg": "",
			"restriction": restriction
		};

		var imageCount = fileInput.files.length;
		var imagesLoaded = 0;

		var reader = [];

		console.log("before store json file");


		var newinput = document.getElementById("resized_img");
		var blob = dataURItoBlob(newinput.value);
       

        console.log(blob)
        if(blob == null){
            alert("No image selected.");
        }
        else{
            get_signed_request(blob, json, currentAccount);
        }

	});
});




function storeJsonFile(json, currentAccount) {
	console.log("storeJsonFile");
	console.log(json);
	usersRef.orderByChild("username").equalTo(currentAccount).once("value", function(snapshot) {
		snapshot.forEach(function(data) {
        	var authorProfileImg = data.val().usrProfileImage;
        	if (authorProfileImg !== undefined)
        		json["authorProfileImg"] = authorProfileImg;
        	var newRef = eventRef.push();
			newRef.set({
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
					// alert to tell the user success and redirect to the index page
					confirm("Your event has been post!");
					window.location.href = '/index'; 
				}
			});	
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
		result.push("Cornell Sponsored");
	if (second)
		result.push("No Charge");
	if (third)
		result.push("Free Food");
	return result;
}







// from: https://github.com/josefrichter/resize/blob/master/public/preprocess.js

var fileinput = document.getElementById('image');

var max_width = fileinput.getAttribute('data-maxwidth');
var max_height = fileinput.getAttribute('data-maxheight');

console.log("fileInput: " + fileinput)
console.log("max_width: " + max_width)
console.log("max_height: " + max_height)


var form = document.getElementById('form');

function processfile(file) {
  
    if( !( /image/i ).test( file.type ) )
        {
            alert( "File "+ file.name +" is not an image." );
            return false;
        }

    // read the files
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onload = function (event) {
      // blob stuff
      var blob = new Blob([event.target.result]); // create blob...
      window.URL = window.URL || window.webkitURL;
      var blobURL = window.URL.createObjectURL(blob); // and get it's URL
      
      // helper Image object
      var image = new Image();
      image.src = blobURL;
      image.onload = function() {
        // have to wait till it's loaded
        var resized = resizeMe(image); // send it to canvas
        var newinput = document.createElement("input");
        newinput.id = "resized_img";
        newinput.type = 'hidden';
        newinput.name = 'images[]';
        newinput.value = resized; // put result from canvas into new hidden input
        console.log(fileinput.files[0]);
        console.log(newinput)
        form.appendChild(newinput);
      }
    };
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

// function dataURItoBlob(dataURI) {
//     var binary = atob(dataURI.split(',')[1]);
//     var array = [];
//     for(var i = 0; i < binary.length; i++) {
//         array.push(binary.charCodeAt(i));
//     }
//     return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
// }

function readfiles(files) {
  
    // remove the existing canvases and hidden inputs if user re-selects new pics
    var existinginputs = document.getElementsByName('images[]');
    var existingcanvases = document.getElementById('resize_canvas');
    console.log(existinginputs)
    console.log(existingcanvases)
    while (existinginputs.length > 0) { // it's a live list so removing the first element each time
      // DOMNode.prototype.remove = function() {this.parentNode.removeChild(this);}
      form.removeChild(existinginputs[0]);
      console.log(existingcanvases)
    } 
  
    for (var i = 0; i < files.length; i++) {
      processfile(files[i]); // process each file at once
    }
    // fileinput.value = ""; //remove the original files from fileinput
    // TODO remove the previous hidden inputs if user selects other files
}

// this is where it starts. event triggered when user selects files
fileinput.onchange = function(){
  if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {
    alert('The File APIs are not fully supported in this browser.');
    return false;
    }
  readfiles(fileinput.files);
}

// === RESIZE ====

function resizeMe(img) {

  console.log("resize me");

  console.log(img);
  
  var canvas = document.createElement('canvas');

  canvas.id = "resize_canvas";

  var width = img.width;
  var height = img.height;


  console.log("width " + width);
  console.log("height " + height);


  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > max_width) {
      //height *= max_width / width;
      height = Math.round(height *= max_width / width);
      width = max_width;
    }
  } else {
    if (height > max_height) {
      //width *= max_height / height;
      width = Math.round(width *= max_height / height);
      height = max_height;
    }
  }
  
  // resize the canvas and draw the image data into it
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  
  
  return canvas.toDataURL("image/jpeg",0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

}
