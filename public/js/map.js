var eventsRef = new Firebase("https://event-finder.firebaseio.com/events");

// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;


function initialize() {
  

  var centroid = { lat: 42.449507, lng: -76.475904 };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: centroid
  });

  console.log("initialize");
  // offsetTop = 60; // Calculate the top offset
  var winHeight = $(window).height();
  console.log(winHeight);
  $('#map').css('height', winHeight-150);

  // // This event listener calls addMarker() when the map is clicked.
  // google.maps.event.addListener(map, 'click', function(event) {
  //   addMarker(event.latLng, map);
  // });

  var currentDateStarting = getDate();
  var currentDateEnding = getDate() + 9999;

  console.log("filtering events start from: " + currentDateStarting + " ending at: " + currentDateEnding);

  eventsRef.orderByChild("startingTime").startAt(currentDateStarting).endAt(currentDateEnding).once("value", function(snapshot) {
    snapshot.forEach(function(data) {
      if (typeof data.val().latOfEvent === "number" && 
          typeof data.val().lngOfEvent === "number") {
        console.log("get an event starting at: " + data.val().startingTime);
        addMarker({lat: data.val().latOfEvent, lng: data.val().lngOfEvent}, map, 
          data.val().nameOfEvent, data.key());
      }
    });
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

// Adds a marker to the map.
function addMarker(location, map, name, id) {
  var contentString ='<a href="/details/' + id + '">'+name+'</a></div>';

  console.log("Content string: " + contentString);

  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map
    
  });

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  makeInfoWindowEvent(map, infowindow, marker);
}

function makeInfoWindowEvent(map, infowindow, marker) {
   google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map, marker);
   });
}

google.maps.event.addDomListener(window, 'load', initialize);
