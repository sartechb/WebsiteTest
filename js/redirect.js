Parse.initialize("OIxxnQzpNgYpAMGuPjTjpsQaMVHsIKqUuAf28doO", "kUK3ReRjKgxRNUlpfLjn06DCvKchXfCQEcvLTOad");
/*
 * The app variable will be a global application variable.
 * One can use the app variable to save debug data and
 * view it at the console. It also helps the app maintain
 * state for uses like filtering.
 */
var app = {};
var refreshLimit = 40000;
//console.log("here", app);

//Store the current User
app.user = Parse.User.current();

//check if the user is logged in. Redirect to login if not logged in
if(app.user == null) {
	window.location.href = "login.html";
} else {
	if(!app.user.get("emailVerified"))
		window.location.href = "welcome.html";
}

