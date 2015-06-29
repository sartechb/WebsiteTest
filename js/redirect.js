Parse.initialize("MQvT5Bq6CsU34IQBfop8fPEJLOsLybDgDMBRdFhM", "HNFXaE7aCayggyI8hyUvbk5kG2sWXH2FpMirSNyC");
/*
 * The app variable will be a global application variable.
 * One can use the app variable to save debug data and
 * view it at the console. It also helps the app maintain
 * state for uses like filtering.
 */
var app = {};
app.filters = {};

console.log("here", app);

app.user = Parse.User.current();

if(app.user == null) {
	window.location.href = "http://sartechb.github.io/WebsiteTest/login.html";
}