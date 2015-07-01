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
    console.log($("input#school"));
    $("input#school").typeahead({
      source: schools.names
    });
  }, error: function(error) {console.log(error);}
});

$("#signerup").submit(
  function (e) {
    e.preventDefault();
   // console.log(e);
    for(var i = 0; i < $("#signerup input").length; ++i) {
      if(e.currentTarget[i].value == "") {
        if($("#signerup").find("div.alert.alert-danger").length == 0) 
          $("#signerup h1").after(errorAlert+"Oops! You missed something below..."+"</div>");
        return;
      }
    }
    var i = 0;
    var school = e.currentTarget[2].value;
    console.log(schoolNames);
    for(i = 0; i < schoolNames.length; ++i) {
      console.log(school, schoolNames[i]);
      if(schoolNames[i] == school) break;
    }
    if(i == schoolNames.length) 
      if($("#signerup").find("div.alert.alert-danger").length == 0) {
          $("#signerup h1").after(errorAlert+"Sorry! Studybuddy isn't available at your school yet! <br>" +
                    "<a href='http://www.getastudybuddy.com'> Please visit us for more information </a>"+"</div>");
          return;
      }

    //school = school.substr(0, school.indexOf('(')-1).trim();

   //  console.log(e);
   //  var info = $("#signerup").serialize();
   //  console.log(e.currentTarget[0].value);
   //  console.log(e.currentTarget[1].value);
   //  console.log(e.currentTarget[2].value);

    var user = new Parse.User();
       
        user.set("name", e.currentTarget[0].value);
        user.set("email", e.currentTarget[1].value);
        user.set("username", e.currentTarget[1].value);
        user.set("password", e.currentTarget[2].value);
        user.set("school", e.currentTarget[3].value);
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
});

$("#logerin").submit(
    function (e) {
      e.preventDefault();
      Parse.User.logIn(e.currentTarget[0].value, e.currentTarget[1].value, {
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
