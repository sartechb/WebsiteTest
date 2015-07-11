//Set Basic Info from User object
$("#user-name h1").html(app.user.get("name"));

$("img#user-photo").attr("src", "assets/"+app.user.get("pic"));

handleResize();
var resizeTimer;
$(window).resize(function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(handleResize, 250);
});

//Get the activePosts, and locations/classes for post create autocomplete 
Parse.Cloud.run("getInitialData", {}, {
  success: function (response) {
   // console.log(response);
    app.activePosts = response.activePosts;
    app.locations = response.locations;
    $("#user-school h3").html(response.name);
    $("input#locFilterAddInput").typeahead({source: response.locations});
    $("#new-post-bar #new-post-place").typeahead({source: response.locations});

    app.classes = response.classes;
    $("input#classFilterAddInput").typeahead({source: response.classes});
    $("#new-post-bar #new-post-class").typeahead({source: response.classes});

    for(var i = 0; i < app.activePosts.length; ++i)
      createActiveLink(app.activePosts[i].title, app.activePosts[i].postId);

    buildPostFeed();
  }, error: function(error){console.log(error);}
});

//If there are filters, we pull filtered posts and shut
//off filtering while the request completes.
function buildPostFeed() {
  app.filteringEnabled = false;
  app.refreshTime = new Date();
  Parse.Cloud.run("getPosts", {nextTen:true,areFilters:false,timeCutOff:app.refreshTime}, {
    success: function(response) {
     app.postOrder = [];
     app.posts = {};
     for(var x = 0; x < response.posts.length; ++x) {
      app.postOrder.push(response.posts[x].postId);
      app.posts[response.posts[x].postId] = response.posts[x];
      app.posts[response.posts[x].postId].filters = [];
    }
      //app.posts = response.posts;
      app.timeCutOff = response.timeCutOff;
      app.areMorePosts = response.areMorePosts;
     //if(app.user.get("filters").length == 0)
      for(var i = 0; i < app.postOrder.length; ++i) {
        createPost(app.posts[app.postOrder[i]], "recent", true);
      }
      //console.log(app.user.get("filters"));
      if(app.user.get("filters").length > 0) {
        getFilterPosts(true, "ERROR", "ERROR");
      } else {
        app.filters = {};
        app.filters.c = [];
        app.filters.l = [];
        app.filters.t = [];
      }
    }, error: function(error) {console.log(error);}
  });
}

function getFilterPosts(ib, fs, ft) {
 //  console.log(ib);
  var filters = [];
  if(ib) {
    filters = app.user.get("filters");
    app.filters = {};
    app.filters.c = [];
    app.filters.l = [];
    app.filters.t = [];
  }
  app.t = 0;
  app.t1 = app.postOrder.length;
  //app.filters = app.user.get("filters");
  for(var x = 0; x < (ib?filters.length:1); ++x) {
    var filtObj;
    if(ib) {
      filtObj = app.user.get("filters")[x].split("|");
      app.filters[filtObj[1]].push({filter:filtObj[0],on:false}); 
    }
    //app.filters.push(JSON.parse(filters[x]));
   //if(ib) console.log(filtObj[0], filtObj[1]);
    Parse.Cloud.run("getPosts", {
      nextTen:false,
      areFilters:true,
      filterString:(ib?filtObj[0]:fs),
      filterType:(ib?filtObj[1]:ft)
    }, {
      success: function(response) {
        for(var i = 0; i < response.posts.length; ++i) {
          if(!(response.posts[i].postId in app.posts)) {
            app.postOrder.push(response.posts[i].postId);
            app.posts[response.posts[i].postId] = response.posts[i];
            app.posts[response.posts[i].postId].filters = [];
            if(!ib)console.log("made new post");
          }
          //console.log(response.filterString, response.posts[i].postId);
          app.posts[response.posts[i].postId].filters.push(response.filterString.replace(/\s+/g, "_"));
        }
        ++app.t;
        if(app.t == app.user.get("filters").length || !ib) {
          fixPosts();
          refreshPostFeed(false);
          if(ib) buildFilters();
        }
      }, error: function(error) {console.log(error);}
    });
  }
}

function fixPosts() {
  //order in terms of time
  if(app.t1 < app.postOrder.length)
    for(var i = app.t1; i < app.postOrder.length; ++i) {
      var postTime = app.posts[app.postOrder[i]].time;
      for(var j = i-1; j >= 0; --j) {
        if(app.posts[app.postOrder[j]].time < postTime) {
          temp = app.postOrder[i];
          app.postOrder[i] = app.postOrder[j];
          app.postOrder[j] = temp;
        }
      }
    }
}

function refreshPostFeed(append, glow) {
  for(var i = 0; i < app.postOrder.length; ++i) {
    if($("#postholder #"+app.postOrder[i]).length == 0) {
      if(i != 0 && !glow) {
        createPost(app.posts[app.postOrder[i]], app.posts[app.postOrder[i]].filters.join(" "),append,app.postOrder[i-1], glow);
      } else {
        console.log("will append: "+append);
        createPost(app.posts[app.postOrder[i]], app.posts[app.postOrder[i]].filters.join(" "),append,"top",glow);
      }
    } else {
      for(var j = 0; j < app.posts[app.postOrder[i]].filters.length; ++j) {
        if(!($("#"+app.postOrder[i]).hasClass(app.posts[app.postOrder[i]].filters[j])))
          $("#"+app.postOrder[i]).addClass(app.posts[app.postOrder[i]].filters[j]);
      }
    }
  }
}

function buildFilters() {
  for(var n = 0; n < app.filters.c.length; ++n) createFilter(app.filters.c[n].filter, "|c");
  for(var o = 0; o < app.filters.l.length; ++o) createFilter(app.filters.l[o].filter, "|l");
  for(var p = 0; p < app.filters.t.length; ++p) createFilter(app.filters.t[p].filter, "|t");
}

function stringToTimeFilter() {

}

function handleResize() {
  if($(window).width() > 768) {
    $("body").addClass("desktop");
  } else {
    $("body").removeClass("desktop");
  }
}

$("a#logout").click(function (e) {
    e.preventDefault();
    //alert("ehh");
    Parse.User.logOut();
    console.log("logging out");
    window.location.href = "http://sartechb.github.io/WebsiteTest/login.html";
});

$('[data-toggle="tooltip"]').tooltip()

