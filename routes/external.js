
/*
 * GET home page.
 */
var m = require('../public/javascripts/something.js');
exports.external = function(req, res){
	var arr = new Array();


//	for (var i = 1000; i < 4600; i+=10) {
//		if (i
//		arr.push(i);

	arr[0] = 'aaa';
	console.log('made it here');
	res.render('index', {
	units: JSON.stringify(arr),
	fs : { sayHi: m.doSomething } });
};
