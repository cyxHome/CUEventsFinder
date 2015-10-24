// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;


function initialize() {
  var barton = { lat: 42.446055, lng: -76.480726 };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: barton
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

  // Add a marker at the center of the map.
  addMarker(barton, map, "A Greener Dinner: Food Days 2015");

  // Add a marker at Kenndy Hall
  addMarker({lat: 42.448319, lng: -76.479427}, map, "Sport show");




}

// Adds a marker to the map.
function addMarker(location, map, name) {
  var contentString ='<a href="details">'+name+'</a></div>';

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
