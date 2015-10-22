// Get all of our popular data, category data and concat them to a single json object
var popular = require('../data/popular.json');
var category = require('../data/category.json');

function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}

var data = {};
data = jsonConcat(data, popular);
data = jsonConcat(data, category);

exports.view = function(req, res){
	console.log(data);
	res.render('index', data);
};