var result = require('../data/searchresult.json');

exports.view = function(req, res){
  res.render('searchlist', result);
};
