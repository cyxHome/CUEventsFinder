var Firebase = require("firebase");
var ref = new Firebase("https://event-finder.firebaseio.com/users");



/**
 * Find the account the user enter when login
 */
exports.findAccount = function(req, res) { 
  var accountName = req.body['username'];

  console.log("server get input accountName: " + accountName);

  ref.orderByChild("username").equalTo(accountName).once("value", function(snapshot) {
    if (snapshot.numChildren() == 0){
      console.log("didn't find such user")
      res.json("not-taken");
    }
    else {
      snapshot.forEach(function(data) {
        res.json(data.val().password);
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

  console.log("checking username: "+ username);

  
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
  console.log(form_data);

  // console.log(form_data['username']);
  // newAccount.save(afterSaving); 

  ref.push().set({
    username: form_data['username'],
    password: form_data['password']
  }, function(error) {
    if (error) {
      console.log("Data could not be saved." + error);
    } else {
      console.log("Data has been saved." + error);
      res.send("OK");
    }
  });

  // function afterSaving(err) {
  //   if(err) {console.log(err); res.send(500); }
  //   res.send("OK");
  // }
}