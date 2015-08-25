var app = {};
app.user = Parse.User.current();

if(app.user != null)
	window.location.href = "home.html";


Parse.Cloud.run("getSchoolNames", {}, {
  success: function(schools) {
    app.schoolNames = schools.names;
    console.log(schools);
    //console.log($("input#signup-school"));
    $("input#school").typeahead({
      source: schools.names
    });
  }, error: function(error) {console.log(error);}
});

$("form#signup").submit(function (e) {
	e.preventDefault();
	var fn = $("#firstName").val();
	var ln = $("#lastName").val();
	var em = $("#email").val();
	var pw = $("#password").val();
	var cf = $("#confirm").val();
	var sc = $("#school").val();

	if(!(fn.length && ln.length && em.length && 
		pw.length && cf.length && sc.length)) {
		$(".miss-match").fadeOut(300);
		$(".non-edu").fadeOut(300);
		$(".new-school").fadeOut(300);
		$(".signup-error").fadeOut(300);
		$(".missing").delay(300).fadeIn(300);
		return;
	}
	if(pw != cf) {
		$(".missing").fadeOut(300);
		$(".non-edu").fadeOut(300);
		$(".new-school").fadeOut(300);
		$(".signup-error").fadeOut(300);
		$(".miss-match").delay(300).fadeIn(300);
		$("#password").val("");
		$("#confim").val();
		return
	}
	var tokens = em.split("\.");
	if(tokens[tokens.length-1] != "edu") {
		$(".missing").fadeOut(300);
		$(".miss-match").fadeOut(300);
		$(".new-school").fadeOut(300);
		$(".signup-error").fadeOut(300);
		$(".non-edu").delay(300).fadeIn(300);
		$("#email").val("");
		return
	}
	if(app.schoolNames.indexOf(sc) == -1) {
		$(".non-edu").fadeOut(300);
		$(".missing").fadeOut(300);
		$(".miss-match").fadeOut(300);
		$(".signup-error").fadeOut(300);
		$(".new-school").delay(300).fadeIn(300);
		$("#school").val("");
		return
	}
	var user = new Parse.User();
    var reg = /\((.*?)\)/;
    var school = reg.exec(sc)[1];
    var schoolQuery = new Parse.Query(Parse.Object.extend("School"));
    schoolQuery.equalTo("location", school);
    schoolQuery.first({
      success: function (response) {
        user.set("name", fn + " " + ln[0] + ".");
        user.set("email", em);
        user.set("username", em);
        user.set("password", pw);
        user.set("school", response);
        user.set("pic", "profile2.png");

        user.signUp(null, {
          success: function (user) { 
            resp = user;
            window.location.href ="home.html";
           // console.log("Did it!");
           // alert("did it");
          },
          error: function (user, error) {
          	console.log(error);
            $(".non-edu").fadeOut(300);
			$(".missing").fadeOut(300);
			$(".miss-match").fadeOut(300);
			$(".new-school").fadeOut(300);
			$(".signup-error").delay(300).fadeIn(300);
			return;
          }
        });
      }, error: function (error) {}
    })
});