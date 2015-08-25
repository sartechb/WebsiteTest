Parse.initialize("hkAI1bVuw3lirFps0pvRPyBGFSa7TjKJOEjYXbkF", "BqFjV4T5FYOsymwWU0xAQ8bibRAPfosLEj1oLEN6");

var app = {};
app.user = Parse.User.current();

if(app.user == null)
	window.location.href = "login.html";
else
	if(app.user.emailVerified)
		window.location.href = "index.html";


