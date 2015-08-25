Parse.initialize("OIxxnQzpNgYpAMGuPjTjpsQaMVHsIKqUuAf28doO", "kUK3ReRjKgxRNUlpfLjn06DCvKchXfCQEcvLTOad");

var app = {};
app.user = Parse.User.current();

if(app.user == null)
	window.location.href = "login.html";
else
	if(app.user.emailVerified)
		window.location.href = "index.html";


