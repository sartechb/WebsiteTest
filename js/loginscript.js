//Using Tharun's account:
Parse.initialize("MQvT5Bq6CsU34IQBfop8fPEJLOsLybDgDMBRdFhM", "HNFXaE7aCayggyI8hyUvbk5kG2sWXH2FpMirSNyC");
var resp;
var errorAlert = "<div class='alert alert-danger'><a href='#'' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";

/*
Parse.Cloud.run("functionNameHere", {data:here}, {
  success: function (string) {
    $("#schools").append(string);
  },
  error: function (error) {
    console.log(error);
  }
});
*/

if(Parse.User.current() != undefined)
  window.location.href = "http://sartechb.github.io/WebsiteTest/index.html";


var rand = Math.ceil((1 - Math.random())*7);
var im = $(".profileSelect img");
im.eq(0).attr("src", "assets/profile"+rand+".png");
rand = Math.ceil((1 - Math.random())*7);
im.eq(1).attr("src", "assets/profile"+rand+".png");
rand = Math.ceil((1 - Math.random())*7);
im.eq(2).attr("src", "assets/profile"+rand+".png");

var schoolNames = [];

Parse.Cloud.run("getSchoolNames", {}, {
  success: function(schools) {
    schoolNames = schools.names;
    console.log(schools);
    console.log($("input#signup-school"));
    $("input#signup-school").typeahead({
      source: schools.names
    });
  }, error: function(error) {console.log(error);}
});

$("#forgot-pass-form").submit(function (e) {
  e.preventDefault();
  if($("#forgot-email").val() == 0) {
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


$("#signerup").submit(
  function (e) {
    e.preventDefault();
   // console.log(e);
   var fname = $("#signup-fname").val();
   var lname = $("#signup-lname").val();
   var email = $("#signup-email").val();
   var pass = $("#signup-pass").val();
   var confirm = $("#signup-confirm").val();
   var school = $("#signup-school").val();

    if(fname.length == 0 || lname.length == 0 || email.length == 0 ||
     pass.length == 0 || school.length == 0) {
        if($("#signerup").find("div.alert.alert-danger").length == 0) 
          $("#signerup h1").after(errorAlert+"Oops! You missed something below..."+"</div>");
        return;
      }
    

    if(email.indexOf(".edu") == -1) 
      if($("#signerup").find("div.alert.alert-danger").length == 0) {
          $("#signerup h1").after(errorAlert+"Sorry! To preserve a great user experience for members,"+
            "we require you use your school email to Sign Up with us. Please read more about how we"+
            "use your information in the link below:"+"</div>");
          return;
      }

    if(schoolNames.indexOf(school) == -1) 
      if($("#signerup").find("div.alert.alert-danger").length == 0) {
          $("#signerup h1").after(errorAlert+"Sorry! Studybuddy isn't available at your school yet! <br>" +
                    "<a href='http://www.getastudybuddy.com'> Please visit us for more information </a>"+"</div>");
          return;
      }

    if(confirm != pass) 
      if($("#signerup").find("div.alert.alert-danger").length == 0) {
          $("#signerup h1").after(errorAlert+"Oops! your passwords didn't match up. Try again!"+"</div>");
          $("#signup-pass").val("");
          $("#signup-confirm").val("");
          return;
      }



    //school = school.substr(0, school.indexOf('(')-1).trim();

   //  console.log(e);
   //  var info = $("#signerup").serialize();
   //  console.log(e.currentTarget[0].value);
   //  console.log(e.currentTarget[1].value);
   //  console.log(e.currentTarget[2].value);

    var user = new Parse.User();
    var reg = /\((.*?)\)/;
    school = reg.exec(school)[1];
    var schoolQuery = new Parse.Query(Parse.Object.extend("School"));
    schoolQuery.equalTo("location", school);
    schoolQuery.first({
      success: function (response) {
        user.set("name", fname + " " + lname[0] + ".");
        user.set("email", email);
        user.set("username", email);
        user.set("password", pass);
        user.set("school", response);
        user.set("filters", []);
        console.log($("#signerup .profileSelect.selected").find("img").attr("src"));
        var pic = $("#signerup .profileSelect.selected").find("img").attr("src").replace("assets/","");
        console.log(pic);
        user.set("pic", pic);

        user.signUp(null, {
          success: function (user) { 
            resp = user;
            window.location.href ="http://sartechb.github.io/WebsiteTest/";
           // console.log("Did it!");
           // alert("did it");
          },
          error: function (user, error) {
            console.log(error.code, error.message);
            if($("#signerup").find("div.alert.alert-danger").length == 0) {
              $("#signerup h1").after(errorAlert+error.message+"</div>")
            }
          }
        });
      }, error: function (error) {}
    })
       
       
});

$("#logerin").submit(
    function (e) {
      e.preventDefault();
      console.log()
      Parse.User.logIn($("#login-email").val(), $("#login-pass").val(), {
        success: function (user) {
          resp = user;
          console.log("success!");
         window.location.href ="http://sartechb.github.io/WebsiteTest/";//need to add new page here
        },
        error: function (user, error) {
            console.log(error.code, error.message);
            if($("#logerin").find("div.alert.alert-danger").length == 0) {
              $("#logerin h1").after(errorAlert+error.message+"</div>")
            }
        }
    });
});

$("#signerup .profileSelect").click(function (e) {
  var img = $(e.target);
  if(img.prop("tagName") == "IMG") img = img.parent();
  $("#signerup .profileSelect").removeClass("selected");
  img.addClass("selected");
});

function loginShow(){
    $("#signup-box").slideToggle(200);
    $("#login-box").slideToggle(200);
    $("#login-button").addClass("selected");
    $("#register-button").removeClass("selected");
}
function regShow(){
    $("#signup-box").slideToggle(200);
    $("#login-box").slideToggle(200);
    $("#register-button").addClass("selected");
    $("#login-button").removeClass("selected");
}
