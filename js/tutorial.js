$("#user-name h1").html(app.user.get("name"));
$("img#user-photo").attr("src", "assets/"+app.user.get("pic"));
$('[data-toggle="tooltip"]').tooltip();

//fetching class & location data from parse
app.user.get("school").fetch({
	success: function(school) {
		$("input#classFilterAddInput").typeahead({source: school.get("classes")});
		$("input#locFilterAddInput").typeahead({source: school.get("locations")});
		app.locations = school.get("locations");
		app.classes = school.get("classes");
		app.user_classes = [];
		app.user_locations = [];
	}, error: function(error) {console.log("error");}
});

//FadeIn effect for the title screen
setTimeout(function() {
	$(".section-1").fadeIn(800);
}, 500);

//Setting Section flow handlers
$(".section-1 .next").click({A: 1, B: 2}, secA_to_secB);
$(".section-2 .next").click({A: 2, B: 3}, secA_to_secB);
$(".section-3 .next").click({A: 3, B: 4}, secA_to_secB);
$(".section-4 .next").click({A: 4, B: 5}, secA_to_secB);
$(".section-5 .next").click({A: 5, B: 6}, secA_to_secB);
$(".section-6 .next").click({A: 6, B: 7}, secA_to_secB);
$(".section-7 .next").click(function () {
	var N = {};
	N.data = {A:7,B:8};
	secA_to_secB(N);
	$("#active-example").removeClass("template-active-post");
});
$(".section-8 .next").click(function () {
	var N = {};
	N.data = {A:8,B:9};
	secA_to_secB(N);
	$("#notificationfeed").fadeIn(300);
});
$(".section-9 .next").click(function () {
	var N = {};
	N.data = {A:9,B:10};
	secA_to_secB(N);
	$("#notificationfeed").fadeOut(300);
	$("#active-example").fadeOut(300);
});

$(".section-1 .skipTutorial").click({A:1,B:10}, secA_to_secB);
$(".section-3 .back").click({A:3,B:2}, secA_to_secB);
$(".section-5 .back").click({A:5,B:4}, secA_to_secB);
$(".section-6 .back").click({A:6,B:5}, secA_to_secB);
$(".section-7 .back").click({A:7,B:6}, secA_to_secB);
$(".section-8 .back").click(function () {
	var N = {};
	N.data = {A:8,B:7};
	secA_to_secB(N);
	$("#active-example").addClass("template-active-post");
});
$(".section-9 .back").click(function () {
	var N = {};
	N.data = {A:9,B:8};
	secA_to_secB(N);
	$("#notificationfeed").fadeOut(300);
});

//Send User to account if validated
$(".w-start").click(function() {
	app.user.fetch({
		success: function(user) {
			if(user.get("emailVerified"))
				window.location.href = "home.html";
			else
				$("#notify-error").fadeIn(300);
		}, error: function(error) {console.log(error);}
	});
});



//Class filter creation handler
$("#classFilterAdd").submit(function (e) {
	e.preventDefault();
	var input = $("#classFilterAddInput"); 
	var text = input.val();
	if(app.classes.indexOf(text) == -1) {
		//user entered a class that doesn't exist yet.
		$("#classFilter .notice.dup").fadeOut(200);
		$("#classFilter .notice.limit").fadeOut(200);
		$(".classFilter .notice.dne").fadeIn(200);
	    setTimeout(function(){$("#classFilter .notice.dne").fadeOut(200);}, 2000);
	    input.val("");
	    return false;
	}
	if(app.user_classes.indexOf(text) != -1) {
		//user enter a duplicate
		$("#classFilter .notice.dne").fadeOut(200);
		$("#classFilter .notice.limit").fadeOut(200);
		$(".classFilter .notice.dup").fadeIn(200);
	    setTimeout(function(){$("#classFilter .notice.dup").fadeOut(200);}, 2000);
	    input.val("");
	    return false;
	}
	if(app.user_classes.length >= 5) {
		$("#classFilter .notice.dne").fadeOut(200);
		$("#classFilter .notice.dup").fadeOut(200);
		$(".classFilter .notice.limit").fadeIn(200);
	    setTimeout(function(){$("#classFilter .notice.limit").fadeOut(200);}, 2000);
	    input.val("");
	    return false;
	}
	app.user_classes.push(text);

	Parse.Cloud.run("createFilter", {
		filter: text,
		type: "c",
		on: false
	},{success:function(s){},error:function (e){console.log(e);}});

	var filter = $(".classFilter .template-filter").clone(true);
	filter.removeClass("template-filter").addClass("w-filter");
	filter.find("H4").text(text);
	$(".classFilter .filterContainer").append(filter);
	input.val("");
	return false;
});
//Location filter creation handler
$("#locFilterAdd").submit(function (e) {
	e.preventDefault();
	var input = $("#locFilterAddInput"); 
	var text = input.val();
	if(app.locations.indexOf(text) == -1) {
		//user entered a class that doesn't exist yet.
		$("#locFilter .notice.dup").fadeOut(200);
		$("#locFilter .notice.limit").fadeOut(200);
		$(".locFilter .notice.dne").fadeIn(200);
	    setTimeout(function(){$("#locFilter .notice.dne").fadeOut(200);}, 2000);
	    input.val("");
	    return false;
	}
	if(app.user_locations.indexOf(text) != -1) {
		//user enter a duplicate
		$("#locFilter .notice.dne").fadeOut(200);
		$("#locFilter .notice.limit").fadeOut(200);
		$(".locFilter .notice.dup").fadeIn(200);
	    setTimeout(function(){$("#locFilter .notice.dup").fadeOut(200);}, 2000);
	    input.val("");
	    return false;
	}
	if(app.user_locations.length >= 5) {
		$("#locFilter .notice.dne").fadeOut(200);
		$("#locFilter .notice.dup").fadeOut(200);
		$(".locFilter .notice.limit").fadeIn(200);
	    setTimeout(function(){$("#locFilter .notice.limit").fadeOut(200);}, 2000);
	    input.val("");
	    return false;
	}
	app.user_locations.push(text);

	Parse.Cloud.run("createFilter", {
		filter: text,
		type: "l",
		on: false
	},{success:function(s){},error:function (e){console.log(e);}});

	var filter = $(".locFilter .template-filter").clone(true);
	filter.removeClass("template-filter").addClass("w-filter");
	filter.find("H4").text(text);
	$(".locFilter .filterContainer").append(filter);
	input.val("");
	return false;
});
//filter color handler 
$(".w-filter").click(function (e){
	var filter = $(e.target);
	if(filter.prop("tagName") == "I") {
	filter = filter.parent().parent();
	removeFilter(filter);
	} else if(filter.prop("tagName") == "H4") 
	filter = filter.parent().parent();
	else if(filter.hasClass("title"))
	filter = filter.parent();

	//visually changes how filter looks
	filter.toggleClass("active");
});

//function for section flow
function secA_to_secB(N) {
	$(".section-"+N.data.A).fadeOut(300);
	$(".section-"+N.data.B).delay(300).fadeIn(300);
}

//stop active link from working
$("#active-example, a.note").click(function (e) {
	e.preventDefault();
	return false;
});

//Log out Functionality
$("a#logout").click(function (e) {
    e.preventDefault();
    //alert("ehh");
    Parse.User.logOut();
    console.log("logging out");
    window.location.href = "http://sartechb.github.io/WebsiteTest/login.html";
});