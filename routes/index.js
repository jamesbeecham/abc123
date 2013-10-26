
/*
 * GET home page.
 */
exports.index = function(req, res){
	var arr = new Array();


//	for (var i = 1000; i < 4600; i+=10) {
//		if (i
//		arr.push(i);

	arr[0] = '4018';
	console.log('array filled in');
	res.render('index', {
	units: JSON.stringify(arr),
});
};
