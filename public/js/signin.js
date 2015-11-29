

$(document).ready(function() {


  /**
	 * Sign up (listening to the submit button in sign-up-form)
	 */
	$('#newAccountCreateButton').click(function(e) {
		e.preventDefault(); 
		var username = $('[name="username"]').val();
		var password = $('[name="password"]').val();

		var div = document.getElementById('error-feedback');
		var successDiv = document.getElementById('success-feedback');
		div.innerHTML = "";
		successDiv.innerHTML = "";

		var json = {
			"username": username,
			"password": password
		};

		if (username.length == 0) {
			div.innerHTML = "please enter username";
			return;
		}
		if (password.length == 0) {
			div.innerHTML = "please enter password";
			return;
		}

		/**
		 * Check if the name has been taken
		 */
		var url_call = '/account/sign-up-name-check';

		// if such email has been found in the database, the user has already sign-up
		$.post(url_call, { username: username }, function(result) {
			if (result == "taken") {
				div.innerHTML = 'the username has been taken';
			}
			else {
				url_call = '/account/add-account';
				$.post(url_call, { json: json }, function(result) {
					successDiv.innerHTML = "You has just joined Cornell Event Finder!"
				});
			}
  		});
	});


	/**
	 * Login (listening to the submit button in login-form)
	 */
	$('#loginRequestSubmitButton').click(function(e) {
		e.preventDefault(); 
		var username = $('[name="username"]').val();
		var password = $('[name="password"]').val();

		var div = document.getElementById('error-feedback');
		var wanningDiv = document.getElementById('wanning-feedback');
		div.innerHTML = "";
		wanningDiv.innerHTML = "";

		var json = {
			"username": username,
			"password": password
		};

		if (username.length == 0) {
			div.innerHTML = "please enter username";
			return;
		}
		if (password.length == 0) {
			div.innerHTML = "please enter password";
			return;
		}
		var url_call = '/account/login';

		/** 
		 * Call back function
		 * Check if the account password match the password that the user has inputed
		 */
		function passwordCheck(result) {

			if (result == "not-taken") {
				wanningDiv.innerHTML = "Can't find username '" + username + "'";
				return;
			}
			if (result == password) {
				document.cookie = "currentAccount = " + username + ";";				
				window.location.href = '/index'; 
			}
			else
			{   
				div.innerHTML = "wrong password";
				return;
			}
		}

		/**
		 * post the input name to the server,
		 * if found such name in database, means there is such an account -> return the account, call passwordCheck to check if the password match the name
		 * if not found, means the name has not been signed up -> won't call passwordCheck, push an alert
		 */
		$.post(url_call, { username: username }, passwordCheck);
	});
});