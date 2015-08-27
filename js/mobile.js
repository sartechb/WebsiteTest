var app = {};
app.user = Parse.User.current();
app._mobile = true;

// if(app.user == null) {
// 	window.location.href = "login.html";
// } else if (!window.location.hash.length) {
// 	window.location.href = "home.html";
// } 

$("#user-name h1").html(app.user.get("name"));
$("img#user-photo").attr("src", "assets/"+app.user.get("pic"));

buildInitialData();

function buildInitialData() {
  Parse.Cloud.run("getInitialData", {}, {
    success: function (response) {
      ////console.log(response);
      app.activePosts = {};
      for(var j = 0; j < response.activePosts.length; ++j) 
        app.activePosts[response.activePosts[j].postId] = 
          response.activePosts[j].title;

      for(var i = 0; i < response.activePosts.length; ++i)
        createActiveLink(response.activePosts[i].title, response.activePosts[i].postId);

       $("#user-school h3").html(response.name);

      setActivePostHandler();
      buildNotifications(true, response.notifications);
    }, error: function(error){console.log(error);}
  });
}

function createActiveLink(title, objectId) {
  var to_insert = $("#active-posts .template-active-post").clone();
  to_insert.removeClass("template-active-post");
  to_insert.attr("id", objectId);
  to_insert.attr("href", "post.html#"+objectId);
  to_insert.find("h3").html(title);
  //add src attribute creation here
  $("#active-posts div.row").append(to_insert);
}

function prettyTime(time) {
  var date = new Date();
  var seconds = Math.round((date - time)/1000);
  var minutes = Math.round(seconds/60);
  var hours = Math.round(minutes/60);
  if(seconds < 20) {
    return "Just Now";
  } else if(seconds < 60) {
    return seconds+" seconds ago";
  } else if (minutes < 60) {
    return minutes+((minutes==1)?" minute ago":" minutes ago");
  } else if (hours < 24) {
    return hours+((hours==1)?" hour ago":" hours ago");
  } else {
    return "More than a day ago";
  }
}

$("a#logout, i.fa-sign-out").click(function (e) {
    e.preventDefault();
    //alert("ehh");
    Parse.User.logOut();
    console.log("logging out");
    window.location.href = "login.html";
});