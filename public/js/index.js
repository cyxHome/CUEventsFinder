$(document).ready( function() {

	$("#contactinfo").load("contactinfo");

	// load navigation bar when the page is ready
    $("#navbar").load("navbar",function(){
    	// load the javascript for navbar and toggle effect
    	$.getScript("js/creative.js"); 
	});
    
});