$(document).ready(function(){
	var winWdth = $(window).width();
	
	if(winWdth > 991){
	var hstHt = $(window).height();
	var hdrHt = $("header").height();
	var ftrHt = $("footer").height();
	$(".wrapper, .left-panel, .right-panel").css('min-height', hstHt);
	$(".content-area").css('min-height', hstHt - (hdrHt + ftrHt + 40));
	}
	
	
	$(window).resize(function(){
		var winWdthR = $(window).width();
		var hdrHt = $("header").height();
		var ftrHt = $("footer").height();
		if(winWdthR > 991){
		var hstHt = $(window).height();
		$(".wrapper, .left-panel, .right-panel").css('min-height', hstHt);
		$(".content-area").css('min-height', hstHt - (hdrHt + ftrHt + 40));
		}
	});
})