Parse.initialize("CRiHeLQl3IT2amq2a9kHCvAwhkmwNn2VEMVaKN5N", "mFcmOluxGuB0QhM3F0BsQW361QI5iPMdVMa8ynaj");
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