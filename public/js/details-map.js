// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

function initialize() {
  var mapHTML = document.getElementById('details-map');
  var lat = $(mapHTML).data('lat');
  var lng = $(mapHTML).data('lng');
  var tomark = { lat: lat, lng: lng };
  var map = new google.maps.Map(document.getElementById('details-map'), {
    zoom: 16,
    center: tomark
  });

  console.log("initialize");
  // offsetTop = 60; // Calculate the top offset
  $('#details-map').css('height', 400);

  // // This event listener calls addMarker() when the map is clicked.
  // google.maps.event.addListener(map, 'click', function(event) {
  //   addMarker(event.latLng, map);
  // });

  // Add a marker at the center of the map.
  addMarker(tomark, map);
}

// Adds a marker to the map.
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
