function makeConfirm() {
	var unit = !{dest};
	alert('here1');
	var divEle = document.getElementById("table");
	divEle.innerHTML += 'You have selected unit <font color=\"#00CCFF\">" + unit.Unit + "</font>, is this correct?<br><br>';
};


$(document).on('pageinit', '#confirm', function () {
	alert('in here!!!!LJKJ');
	console.log('abc123');

	makeConfirm();
});
