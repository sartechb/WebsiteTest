
$("signerup").submit( function (e) {signup(e.target);});
function signup (e) {
Parse.initialize("CRiHeLQl3IT2amq2a9kHCvAwhkmwNn2VEMVaKN5N", "mFcmOluxGuB0QhM3F0BsQW361QI5iPMdVMa8ynaj");

  var user = new Parse.User();
      var resp;
      user.set("username", e.name.value);
      user.set("password", e.password.value);
      user.set("email", e.email.value);

      user.signUp(null, {
        success: function (user) { 
          resp = user;
          console.log("Did it!");
          alert("did it");
        },
        error: function (user, error) {
          console.log(error.code, error.message);
        }
      });
}