var app = {};
app.user = Parse.User.current();

if(app.user != null)
	window.location.href = "login.html";

$("form#login").submit(function (e) {
	e.preventDefault();
	var email = $("input#email").val();
	var password = $("input#password").val();
	Parse.User.logIn(email, password, {
		success: function (s) {
			window.location.href="index.html";
		}, error: function(error) {
			$("div.card").effect("shake", {direction:"left"}, 250);
			$("input#email").val("");
			$("input#password").val("");
		} 
	});
});

$("#forgot-pass-form").submit(function (e) {
  e.preventDefault();
  if($("#forgot-email").val().length == 0) {
    $("#forgot-pass-form .notice").fadeIn(400);
    setTimeout(function () {$("#forgot-pass-form .notice").fadeOut(400);}, 10000);
    return;
  }
  Parse.User.requestPasswordReset($("#forgot-email").val(), {
	  success: function() {
	    $("#forgot-pass-form .error").hide();
	    $("#forgot-pass-form .success").fadeIn(400);
	  },
	  error: function(error) {
	    // Show the error message somewhere
	    $("#forgot-pass-form .error").fadeIn(400);
	  }
  });
});