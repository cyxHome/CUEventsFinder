var Firebase = require("firebase");
// var ref = new Firebase("https://event-finder.firebaseio.com/users");
var ref = new Firebase("https://event-finder-test.firebaseio.com/users");



/**
 * Find the account the user enter when login
 */
exports.findAccount = function(req, res) { 
  var accountName = req.body['username'];


  ref.orderByChild("username").equalTo(accountName).once("value", function(snapshot) {
    if (snapshot.numChildren() == 0){
        res.json("not-taken");
    }
    else {
        snapshot.forEach(function(data) {
            res.json(data.val().password);
            return;
        });
    }
  });
}



/**
 * Check if the name has been taken when the user try to sign-up
 */
exports.nameCheck = function(req, res) {

  var username = req.body['username'];
  var password = req.body['password'];


  
  var taken = false;
  ref.orderByChild("username").equalTo(username).once("value", function(snapshot) {
    if (snapshot.numChildren() == 0)
      res.json("not-taken");
    else
      res.json("taken");      
  });

}


/**
 * Add an account to the database after the user has signed up
 */
exports.addAccount = function(req, res) {
  var form_data = req.body['json'];


  ref.push().set({
    username: form_data['username'],
    password: form_data['password'],
    age: 20,
    gender: "",
    interests: ["None"],
    myPostNumber: 0,
    myAttendenceNumber: 0,
    nickname: "",
    usrProfileImage: "",
    whatsup: ""
  }, function(error) {
    if (error) {
      console.log("Data could not be saved." + error);
    } else {
      console.log("Data has been saved." + error);
      res.send("OK");
    }
  });

}