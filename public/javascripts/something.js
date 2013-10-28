/*$(document).on('pageinit', '.ui-page', function () {
	console.log('ready to load page load!!!');
});*/
$(document).on('pageinit', '.ui-page', function () {
	console.log('going to change listview');
//find the filter input on this pseudo-page
    var $filterInput = $(this).find('.ui-listview').prev('.ui-listview-filter').find('input');
        console.log('going to change this list-view dog');    
	//create a clone of the filter input on this pseudo-page
                   $clone       = $filterInput.clone(true);
	console.log('its cloned');
                        //replace the original input with the clone
        $filterInput.replaceWith($clone.attr('type', 'tel'));
});
