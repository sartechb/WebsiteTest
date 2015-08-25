Parse.initialize("hkAI1bVuw3lirFps0pvRPyBGFSa7TjKJOEjYXbkF", "DtCJuQjyXYA9rMTASQc55f4ik0ixCg6KHk5iiok1");

var app = {};
app.user = Parse.User.current();

if(app.user == null)
	window.location.href = "login.html";
else
	if(app.user.emailVerified)
		window.location.href = "index.html";


