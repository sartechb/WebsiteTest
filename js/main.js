
  //console.log(app);
app.Post = Parse.Object.extend("Post");

if(app.user != null) 
  app.Post = Parse.Object.extend("Post");
//post_query = new Parse.Query(app.Post);
  //user_query = new Parse.Query(Parse.User);
Parse.Cloud.run("getUniversityPostData", {}, {
  success: function(r) {
    //console.log(r);
    app.posts = r.activePosts;
    for(var i = 0; i < r.activePosts.length; ++i) {
      var post = r.activePosts[i];
      //pretty time function here
      createPost(post.title, post.content, post.poster, post.location,
        post.Class+" "+post.classNumber, post.createdAt.toString(), post.objectId);
    }

    Parse.Cloud.run("getFilterData", {}, {
      success: function (r) {
        console.log(r, app.filters);
        for(var i = 0; i < r.filters.length; ++i) {
          createFilter(r.filters[i].name);
          var filter_id = r.filters[i].name.replace(" ","_");
          app.filters[filter_id] = [];
          if(r.filters[i].type == "CLASS_CLASSNUMBER") {
            for(var j = 0; j < app.posts.length; ++j) {
              if(app.posts[j].Class+"_"+app.posts[j].classNumber == filter_id)
                app.filters[filter_id].push(app.posts[j].objectId);
            }
          }
        }
      }, error: function (r) {console.log(r);}
    });

  },error: function(r) {console.log(r);}
});

Parse.Cloud.run("getBasicData", {}, {
  success: function(r) {
    console.log(r);
    $("#user-name h1").html(r.name);
    $("#user-school h3").html(r.school);
    $("img#user-photo").attr("src", "assets/"+r.pic);
  }, error: function(r) {console.log(r);}
});


Parse.Cloud.run("getActivePostData", {}, {
  success: function(r) {
    console.log(r);
    app.activePosts = [];
    for(var i = 0; i < r.activePosts.length; ++i) {
      createActiveLink(r.activePosts[i].title);
      app.activePosts.push(r.activePosts[i].objectId);
    }
  }, error: function(r) {console.log(r);}
});
//$("#user-name h1").html(app.user.get("name"));
//$("#user-school h3").html(app.user.get("school"));




$("a#logout").click(function (e) {
    e.preventDefault();
    //alert("ehh");
    Parse.User.logOut();
    console.log("logging out");
    window.location.href = "http://sartechb.github.io/WebsiteTest/login.html";
});

function test(obj) {
  Parse.Cloud.run("makeFilter", obj, {
    success: function (r) {
      console.log(r);
    }, error: function (r) {console.log(r);}
  });
}

o = {
  type: "CLASS_CLASSNUMBER",
  Class: "EECS",
  classNumber: 280
};