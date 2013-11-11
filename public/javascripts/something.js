/*$(document).on('pageinit', '.ui-page', function () {
	console.log('ready to load page load!!!');
});*/
$(document).on('pageshow', '.ui-page', function () {
//find the filter input on this pseudo-page
//    var $filterInput = $(this).find('.ui-listview').prev('.ui-listview-filter').find('input');
//	var $f = $(this).find('.ui-listview');
	if (top.location.pathname === '/pickup') {
		var $input = $( "form").first().find('input');
	//create a clone of the filter input on this pseudo-page
        	$clone       = $input.clone(true);
		$clone.attr('placeholder','Unit for pickup..');
                  //replace the original input with the clone
     		$input.replaceWith($clone.attr('type', 'tel'));
	}
});


