//Set Basic Info from User object
$("#user-name h1").html(app.user.get("name"));

$("img#user-photo").attr("src", "assets/"+app.user.get("pic"));

app.util = {};

handleResize();
var resizeTimer;
$(window).resize(function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(handleResize, 250);
});

buildInitialData();

setTimeout(runUpdates, 40000);//run updates in 40 seconds
//Get the activePosts, and locations/classes for post create autocomplete 
function buildInitialData() {
  Parse.Cloud.run("getInitialData", {}, {
    success: function (response) {
      //console.log(response);
      //app.joinedPosts = response.joinedPosts;
      app.activePosts = {};
      app.reportedPosts = response.reportedPosts;
      //console.log(response.activePosts);
      for(var j = 0; j < response.activePosts.length; ++j) 
        app.activePosts[response.activePosts[j].postId] = 
          response.activePosts[j].title;

      app.locations = response.locations;
      $("#user-school h3").html(response.name);
      $("input#locFilterAddInput").typeahead({source: response.locations});
      $("#new-post-bar #new-post-place").typeahead({source: response.locations});

      app.classes = response.classes;
      $("input#classFilterAddInput").typeahead({source: response.classes});
      $("#new-post-bar #new-post-class").typeahead({source: response.classes});

      for(var i = 0; i < response.activePosts.length; ++i)
        createActiveLink(response.activePosts[i].title, response.activePosts[i].postId);

      setActivePostHandler();
      buildFilterPosts();
      //buildPostFeed(true);
      
      
    }, error: function(error){console.log(error);}
  });
}
//create the initial PostFeed
function buildPostFeed(init) {
  //app.filteringEnabled = false;
  app.refreshTime = new Date();
  var report = app.reportedPosts || [];
  var cArray = getPropertyArray(app.filters.c, "filter");
  var lArray = getPropertyArray(app.filters.l, "filter");
  var tArray = getPropertyArray(app.filters.t, "filter");
  if(cArray.length == 0) cArray = [""];
  if(lArray.length == 0) lArray = [""];
  if(tArray.length == 0) tArray = ["","",""];
  if(tArray.length == 1) {tArray.push(""); tArray.push("");}
  if(tArray.length == 2) tArray.push("");
  

  Parse.Cloud.run("getMorePosts", {
    timeCutOff:app.refreshTime,
    update:false,
    classFilter:cArray,
    locationFilter:lArray,
    textFilter:tArray
  }, {
    success: function(response) {
     // console.log(response);
      app.posts = {};
      var order = new BST(postOrdering);
      for(var x = 0; x < response.posts.length; ++x) {
        var id = response.posts[x].postId;
      //  console.log(id, report);
        if(!(id in app.posts) && report.indexOf(id) == -1) {
          app.posts[id] = response.posts[x];
          order.insert(id);
        } 
      }
      order.doOp(addPostToFeed1);

      app.refreshTime = response.timeCutOff;
      app.updateTime = new Date();
      app.areMorePosts = response.areMorePosts;

     $("#loader").remove();
     applyJoinButtonHandler();
     applyGoToGroupButtonHandler();
     applyFilterChanges();
     //$("#empty-feed").hide();
     //console.log("removed");
    // console.log(init+" yes?");
      //if(init) buildFilterPosts();
    }, error: function(error) {console.log(error);}
  });
}

function buildFilterPosts() {
  app.filters = {};
  app.filters.c = [];
  app.filters.l = [];
  app.filters.t = [];

  Parse.Cloud.run("getFilters", {}, {
    success: function(response) {
      if(response.size){
        for(var i = 0; i < response.filters.c.length; ++i) 
          app.filters.c.push(new filterObject(response.filters.c[i].filter, response.filters.c[i].on));
        for(var i = 0; i < response.filters.l.length; ++i) 
          app.filters.l.push(new filterObject(response.filters.l[i].filter, response.filters.l[i].on));
        for(var i = 0; i < response.filters.t.length; ++i) 
          app.filters.t.push(new filterObject(response.filters.t[i].filter, response.filters.t[i].on));
        app.util.totalFilters = app.filters.c.length?1:0 + 
          app.filters.l.length?1:0 + app.filters.t.length;

        buildFilters();

        //if(app.filters.c.length) getFilterPosts("c");
        //if(app.filters.l.length) getFilterPosts("l");
        //if(app.filters.t.length) getFilterPosts("t");

        //getAggregatePosts();
        

      } else updatePostUI();
      buildPostFeed(true);
    }, error: function(error) {console.log(error);}
  });
}

function getAggregatePosts() {
  var classes = [];
  var locations = [];
  var texts = ["wobetto","",""];
  classes = getPropertyArray(app.filters.c, "filter");
  locations = getPropertyArray(app.filters.l, "filter");

  Parse.Cloud.run("getAggregate", {
    classFilter:classes,
    locationFilter:locations,
    textFilter:texts
  }, {
    success: function(response) {
      console.log(response);
    }, error: function(e) {console.log(e);}
  });
}

function getFilterPosts(type, addFilter) {
  //console.log("getFilterPosts");
  //var report = app.reportedPosts || [];

  var cArray = [""];
  var lArray = [""];
  var tArray = ["","",""];

  if(type == "c") cArray[0] = app.filters.c[app.filters.c.length-1].filter;
  else if (type == 'l') lArray[0] = app.filters.l[app.filters.l.length-1].filter;
  else if (type == 't') tArray[0] = app.filters.t[app.filters.t.length-1].filter;

  Parse.Cloud.run("getMorePosts", {
    classFilter: cArray,
    locationFilter: lArray,
    textFilter: tArray,
    timeCutOff: app.refreshTime,
    update:false
  }, {
    success: function(response) {//class & location
   //   console.log(response);
      for(var k = 0; k < response.posts.length; ++k) 
        addToPosts(response.posts[k].postId, response.posts[k]);
      app.util.totalFilters--;
      if(app.util.totalFilters==0) 
        updatePostUI();
    }, error: function(error) {console.log(error);}
  });
0
}

function addToPosts(id, post) {
  var report = app.reportedPosts;
 // console.log(report, id);
  if(!(id in app.posts) && report.indexOf(id) == -1)
    app.posts[id] = post;
}

function updatePostUI(add) {
 // console.log("updatePostUI");
  app.util.lastPost = null;
  var order = new BST(postOrdering);
  for(var id in app.posts) 
    if(app.posts.hasOwnProperty(id))
      order.insert(id);
  if(add)
    order.doOp(insertToPostFeed);
  else  
    order.doOp(fixPostFeed);
  applyJoinButtonHandler();
  applyGoToGroupButtonHandler();
  applyFilterChanges();
}

function insertToPostFeed(id) {
  if(!$("#postholder #"+id).length)
    createPost(app.posts[id], "recent", false);
  app.util.lastPost = id;
}

function fixPostFeed(id) {
  //console.log(app.util.lastPost, id);
  if(!$("#postholder #"+id).length)
    createPost(app.posts[id], "recent", false, app.util.lastPost, true);
  app.util.lastPost = id;
}

function buildFilters() {
  for(var n = 0; n < app.filters.c.length; ++n) 
    createFilter(app.filters.c[n].filter, "|c", app.filters.c[n].on);
  for(var o = 0; o < app.filters.l.length; ++o) 
    createFilter(app.filters.l[o].filter, "|l", app.filters.l[o].on);
  for(var p = 0; p < app.filters.t.length; ++p) 
    createFilter(app.filters.t[p].filter, "|t", app.filters.t[p].on);
}

function runUpdates() {
  //get the posts that were recently made and order them and build them
  console.log("ran an update");
  var report = app.reportedPosts || [];
  var cArray = getPropertyArray(app.filters.c, "filter");
  var lArray = getPropertyArray(app.filters.l, "filter");
  var tArray = getPropertyArray(app.filters.t, "filter");
  if(cArray.length == 0) cArray = [""];
  if(lArray.length == 0) lArray = [""];
  if(tArray.length == 0) tArray = ["","",""];
  if(tArray.length == 1) {tArray.push(""); tArray.push("");}
  if(tArray.length == 2) tArray.push("");

  Parse.Cloud.run("getMorePosts", {
    update: true,
    timeCutOff: app.refreshTime,
    classFilter:cArray,
    locationFilter:lArray,
    textFilter:tArray
  }, {
    success: function (response) {
     // var order = new BST(postOrdering);
      for(var i = 0; i < response.posts.length; ++i) {
        var id = response.posts[i].postId;
      //  console.log(id, report);
        if(!(id in app.posts)) {
          app.posts[id] = response.posts[i];
        //  order.insert(id);
        }
      }
     // order.doOp(addPostToFeed1);
      app.refreshTime = app.timeCutOff || new Date();

      updatePostUI();

    }, error: function (error) {console.log(error);}
  });

  //get update objects and apply changes
  //TO-DO

  setTimeout(runUpdates, 40000);
}

function applyJoinButtonHandler() {
  console.log("hi");
  $("#postfeed .post .btn.join").click(function(e) {
    var post = $(e.target);
    post = post.closest(".post");
    window.location.href = "post.html" + "#" + post.attr("id");
    });
   
}

function applyGoToGroupButtonHandler() {
  $("#postfeed .post .btn.goToGroup").click(function(e) {
    var post = $(e.target).closest(".post").attr("id");
    var url = 
      //"file:///Users/gapoorva/Documents/sandbox/trunk/Dev/StudybuddyTest/WebsiteTest/post.html";
       "post.html";
      window.location.href = url + "#" + post;
  });
}


function postOrdering(a, b) {
  //a and b are postIds
  //console.log(app.posts[a].time < app.posts[b].time);
  if(app.posts[a].time == app.posts[b].time)
    return a > b;
  else return app.posts[a].time < app.posts[b].time;
}
function addPostToFeed1(id) {createPost(app.posts[id], "recent", true);}

function handleResize() {
  var w = $(window).width();
  if(w > 1200) {
    $("body").addClass("lg").removeClass("md sm xs");
  } else if (w > 992 && w <= 1200) {
    $("body").addClass("md").removeClass("lg sm xs");
  } else if (w > 768 && w <= 992) {
    $("body").addClass("sm").removeClass("lg md xs");
  } else {
    $("body").addClass("xs").removeClass("lg md sm");
  }
}

function getPropertyArray(aofo, k) {
  var ret = [];
  for(var i = 0; i < aofo.length; ++i)
    ret.push(aofo[i][k]);
  return ret;
}

function filterObject(s, _on) {
  this.filter = s; //with spaces (UI display)
  this.id = s.replace(/\s+/g, "_"); //with underscores (attr)
  this.on = _on;
}

$("a#logout").click(function (e) {
    e.preventDefault();
    //alert("ehh");
    Parse.User.logOut();
    console.log("logging out");
    window.location.href = "http://sartechb.github.io/WebsiteTest/login.html";
});

$('[data-toggle="tooltip"]').tooltip();

