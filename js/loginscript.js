Parse.initialize("CRiHeLQl3IT2amq2a9kHCvAwhkmwNn2VEMVaKN5N", "mFcmOluxGuB0QhM3F0BsQW361QI5iPMdVMa8ynaj");
var resp;
var errorAlert = "<div class='alert alert-danger'><a href='#'' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
$("#signerup").submit(
  function (e) {
    e.preventDefault();
   //  console.log(e);
   //  var info = $("#signerup").serialize();
   //  console.log(e.currentTarget[0].value);
   //  console.log(e.currentTarget[1].value);
   //  console.log(e.currentTarget[2].value);

    var user = new Parse.User();
       
        user.set("username", e.currentTarget[0].value);
        user.set("email", e.currentTarget[1].value);
        user.set("password", e.currentTarget[2].value);

        user.signUp(null, {
          success: function (user) { 
            resp = user;
           // console.log("Did it!");
           // alert("did it");
          },
          error: function (user, error) {
            console.log(error.code, error.message);
            $("#signerup h1").after(errorAlert+error.message+"</div>")
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
          window.location.href ="http://www.apoorvagupta.com";//need to add new page here
        },
        error: function (user, error) {
            console.log(error.code, error.message);
            $("#logerin h1").after(errorAlert+error.message+"</div>")
        }
    });
});