
/*
 * GET home page.
 */
exports.index = function(req, res, arr){
	console.log('array filled in');
	res.render('index', {
	units: JSON.stringify(arr),
});
};
