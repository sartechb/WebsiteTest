var slide = 1;
var total = 0;
var profile = "profile1.png";

$(".section1").delay(300).fadeIn(500);

$(".section .next").click(function (e) {
	var button = $(e.target);
	$(".section"+slide).fadeOut(300);
	++slide;
	if(slide == 11) calculateScore(total);
	$(".section"+slide).delay(300).fadeIn(500);
	if(button.data("points"))
		total += button.data("points");
	console.log(total);
});

function calculateScore(i) {
	if(i > 29) profile = "profile5.png";
	else if(i > 26) profile = "profile5.png";
	else if(i > 23) profile = "profile6.png";
	else if(i > 20) profile = "profile2.png";
	else if(i > 17) profile = "profile7.png";
	else if(i > 14) profile = "profile3.png";
	else if(i > 11) profile = "profile1.png";
	else if(i > 8) profile = "profile4.png";
	else profile = "profile9.png";
	$("img.result").attr("src", "assets/"+profile);
	var user = Parse.User.current();
	user.set("pic", profile);
	user.save();
}

$(".finish").click(function (e) {
	window.location.href="home.html";
});

