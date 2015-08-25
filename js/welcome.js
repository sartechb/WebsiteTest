Parse.initialize("OIxxnQzpNgYpAMGuPjTjpsQaMVHsIKqUuAf28doO", "3FC4ECnN2TUrD5tFWdQIBAnyyOm9BAQ4O1GeVeIs");

var app = {};
app.user = Parse.User.current();

if(app.user == null)
	window.location.href = "login.html";
else
	if(app.user.emailVerified)
		window.location.href = "index.html";
console.log("Please stop poking around");

