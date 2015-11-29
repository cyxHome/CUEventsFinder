ECE MEng Project: A Events Finder for Cornell University. 

Problems:
1. Some fade-in animation is not capatible with Firefox Browser (had not tested on browsers other  than Chrome and Firefox yet). It works unstably on Chrome. (Removed on 11/29/2015)
2. Use JQuery to load Navbar result in "uncaught exception: Syntax error, unrecognized expression" when clicking on the link. It doesn't seems to be affecting redirection, but do display an error on the console.
3. The loading of marker is so slow (maybe because I evilly put database query on the front end js). Should be fixed soon. 

Optimization:
The page loading speed is so slow, and some css files seems to be loaded after the webpage has been displayed. So some font unintentionaly changed in front of the user. 
