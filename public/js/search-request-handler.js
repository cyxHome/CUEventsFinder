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
		var url_call = '/search-events-by-keyworld';

		// if such email has been found in the database, the user has already sign-up
		$.post(url_call, { keyword: keyword }, function(result) {
			if (result == "taken") {
				console.log("taken");
				div.innerHTML = 'the username has been taken';
			}
			else {
				console.log("not-taken");
				url_call = '/account/add-account';
				$.post(url_call, { json: json }, function(result) {
					console.log("successfully add an account");
					successDiv.innerHTML = "You has just joined Cornell Event Finder!"
				});
			}
  		});
	});

});