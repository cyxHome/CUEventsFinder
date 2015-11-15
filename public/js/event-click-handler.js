$(document).ready( function() {

	$('.event-click').click(function(e) {
		e.preventDefault(); 

		var id = $(this).data('internalid');

		console.log("event " + id + " has been clicked");

		$.post('/event-details', { id: id }, function() {
			console.log("finished getting event details");
			window.location.href = '/details'; 
		});

	});

});