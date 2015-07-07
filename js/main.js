//Set Basic Info from User object
$("#user-name h1").html(app.user.get("name"));
$("#user-school h3").html(app.user.get("school"));
$("img#user-photo").attr("src", "assets/"+app.user.get("pic"));

//Get the activePosts, and locations/classes for post create autocomplete 
Parse.Cloud.run("getInitialData", {}, {
  success: function (response) {
   // console.log(response);
    app.activePosts = response.activePosts;
    app.locations = response.locations;
    app.classes = response.classes;
    for(var i = 0; i < app.activePosts.length; ++i)
      createActiveLink(app.activePosts[i].title, app.activePosts[i].postId);
  }, error: function(error){console.log(error);}
});

app.refreshTime = new Date();
Parse.Cloud.run("getPosts", {nextTen:true,areFilters:false,timeCutOff:app.refreshTime}, {
  success: function(response) {
   // console.log(response);
    app.posts = response.posts;
    app.timeCutOff = response.timeCutOff;
    app.areMorePosts = response.areMorePosts;
   //if(app.user.get("filters").length == 0)
    for(var i = 0; i < app.posts.length; ++i) 
      createPost(app.posts[i], "recent");
    if(app.user.get("filters").length == 0) {
      $(".post.recent").show(200);
    } else {
      $(".post.recent").hide(200);
    }
     
  }, error: function(error) {console.log(error);}
});

$("a#logout").click(function (e) {
    e.preventDefault();
    //alert("ehh");
    Parse.User.logOut();
    console.log("logging out");
    window.location.href = "http://sartechb.github.io/WebsiteTest/login.html";
});