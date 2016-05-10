// var eventsRef = new Firebase("https://event-finder.firebaseio.com/events");
eventsRef = new Firebase("https://event-finder-test.firebaseio.com/events");

// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

// dictionary (from id to markers) so that can change color of 
// marker when hovering above and leaving it
var markers = {};
var infowindows = {};
var infowindowforclicks = {};
var infoContents = {};
var locations = {};
var listenerIdentifiers = {}
var idToMarkerID = {}
var map;

function initialize() {
  

  var centroid = { lat: 42.449507, lng: -76.475904 };
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 14,
    scrollWheel: false,
    center: centroid
  });

  // marker.setMap(map);

  console.log("initialize");
  // offsetTop = 60; // Calculate the top offset
  var winHeight = $(window).height();
  console.log(winHeight);
  // $('#map').css('height', winHeight-150);

  // // This event listener calls addMarker() when the map is clicked.
  // google.maps.event.addListener(map, 'click', function(event) {
  //   addMarker(event.latLng, map);
  // });

  var currentDateStarting = getDate();
  var currentDateEnding = getDate() + 9999;

  console.log("filtering events start from: " + currentDateStarting + " ending at: " + currentDateEnding);

  
  eventsRef.orderByChild("startingTime").startAt(currentDateStarting).endAt(currentDateEnding).once("value", function(snapshot) {
  // eventsRef.orderByChild("startingTime").once("value", function(snapshot) {
    snapshot.forEach(function(data) {
      if (typeof data.val().latOfEvent === "number" && 
          typeof data.val().lngOfEvent === "number") {
        console.log("get an event starting at: " + data.val().startingTime);
        addMarker({lat: data.val().latOfEvent, lng: data.val().lngOfEvent}, map, 
          data.val().nameOfEvent, data.key(), data.val().locationOfEvent);
        $( "#" + data.key() ).mouseenter( handlerIn ).mouseleave( handlerOut );
      }
    });
  });
}


function handlerIn() {
  var id = $(this).attr('id');
  console.log("in " + id);
  var location = locations[id]
  var markerID = location.lat + ";" + location.lng;

  markers[markerID].setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
  infowindows[id].open(map, markers[markerID]);
  map.panTo(locations[id]);
  for (var key in infowindowforclicks) {
        infowindowforclicks[key].close();
  }
  map.setZoom(16);
}

function handlerOut() {
  var id = $(this).attr('id');
  console.log("out " + id);
  var location = locations[id]
  var markerID = location.lat + ";" + location.lng;

  markers[markerID].setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
  infowindows[id].close();
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
function addMarker(location, map, name, id, locationOfEvent) {
  var contentString ='<a href="/details/' + id + '">'+name+'</a></div>';


  locations[id] = location;

  // the infomation window to display when mouse hover to the item. 
  var infowindow = new google.maps.InfoWindow({
    content: "<p>"+locationOfEvent+"</p>"
  });
  infowindows[id] = infowindow;

  // only create one marker for a lat,lng pair. 
  var markerID = location.lat + ";" + location.lng;


  // append new entry to the information window content if the location is already marked. 
  // remove the old listener for the marker. 
  var infoContent = ""
  if (markerID in infowindowforclicks) {
      google.maps.event.removeListener(listenerIdentifiers[markerID]);
      infoContent = infoContents[markerID];
      console.log("get infoContent from map: " + infoContent);
  }
  var tmp = contentString + "<br><p>"+locationOfEvent+"</p><br>";
  infoContent = infoContent + tmp;
  infoContents[markerID] = infoContent;

  console.log("infoContent: " + infoContent);

  // the information window to display when the user click on the marker
  var infowindowforclick = new google.maps.InfoWindow({
    content: infoContent
  });

  infowindowforclicks[markerID] = infowindowforclick;


  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    // label: labels[labelIndex++ % labels.length],
    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    animation: google.maps.Animation.DROP,
    map: map

  });

  markers[markerID] = marker;

  makeInfoWindowEvent(map, infowindowforclick, marker, markerID);

}

function makeInfoWindowEvent(map, infowindow, marker, markerID) {
    var identifier = google.maps.event.addListener(marker, 'click', function() {
        for (var key in infowindowforclicks) {
          infowindowforclicks[key].close();
        }
        infowindow.open(map, marker);
    });
    listenerIdentifiers[markerID] = identifier
}

google.maps.event.addDomListener(window, 'load', initialize);
