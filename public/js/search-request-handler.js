$(document).ready(function() {

	/**
	 * Sign up (listening to the submit button in sign-up-form)
	 */
	$('#searchRequestSubmitButton').click(function(e) {
		e.preventDefault(); 
		console.log('clicked searchRequestSubmitButton');
		var keyword = $('[name="searching-events-input"]').val();
		console.log("keyword: " + keyword);

		/**
		 * Check if the name has been taken
		 */
		var url_call = '/search-events-by-keyword/' + keyword;

		window.location.href = url_call; 
	});

});