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
buildPostFeed(true);
buildInitialData();
//Get the activePosts, and locations/classes for post create autocomplete 
function buildInitialData() {
  Parse.Cloud.run("getInitialData", {}, {
    success: function (response) {
      //console.log(response);
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

      
    }, error: function(error){console.log(error);}
  });
}
//create the initial PostFeed
function buildPostFeed(init) {
  //app.filteringEnabled = false;
  app.refreshTime = new Date();
  var report = app.user.get("reportedPosts") || [];
  Parse.Cloud.run("getMorePosts", {timeCutOff:app.refreshTime}, {
    success: function(response) {
     //app.postOrder = [];
     //hashmap of post objects
      app.posts = {};
      var order = new BST(postOrdering);
      for(var x = 0; x < response.posts.length; ++x) {
        var id = response.posts[x].postId;
        if(!(id in app.posts) && report.indexOf(id) == -1) {
          //app.postOrder.push(response.posts[x].postId);
          app.posts[id] = response.posts[x];
          order.insert(id);
          //app.posts[response.posts[x].postId].filters = [];
        } 
      }
      order.doOp(addPostToFeed1);
   // console.log(app.postOrder);
      //app.posts = response.posts;
      //keep the refresh time of oldest post retrieved normally
      app.refreshTime = response.timeCutOff;
      app.areMorePosts = response.areMorePosts;
     //if(app.user.get("filters").length == 0)
     //Remove the loading animation
     $("#loader").remove();
      // for(var i = 0; i < app.postOrder.length; ++i) {
      //   createPost(app.posts[app.postOrder[i]], "recent", true);
      // }
      //console.log(app.user.get("filters"));
      //start filter objects
      if(init) buildFilterPosts();
    }, error: function(error) {console.log(error);}
  });
}

function buildFilterPosts() {
  app.filters = {};
  app.filters.c = [];
  app.filters.l = [];
  app.filters.t = [];

  if(app.user.get("filters").length) {
    var fs = app.user.get("filters");
    for(var i = 0; i < fs.length; ++i) {
      var f  = fs[i].split("|");
      if(f[1] == "c")
        app.filters.c.push(new filterObject(f[0]));
      else if (f[1] == "l")
        app.filters.l.push(new filterObject(f[0]));
      else if (f[1] == "t")
        app.filters.t.push(new filterObject(f[0]));
    }
    app.util.totalFilters = app.filters.c.length?1:0 + 
      app.filters.l.length?1:0 + app.filters.t.length;

      //console.log(app.filters);

    buildFilters();

    if(app.filters.c.length) getFilterPosts("c");
    if(app.filters.l.length) getFilterPosts("l");
    if(app.filters.t.length) getFilterPosts("t");
  }
}

function getFilterPosts(type, addFilter) {
  var str = {};
  if(addFilter && app.filters[type].length) {
    str[type] = [];
    str[type].push(app.filters.c[app.filters.c.length -1])
    app.util.totalFilters = type=="t"?app.filters.t.length:1;
  } else if (!addFilter) {
     str[type] = getPropertyArray(app.filters[type], "filter");
     //console.log(str[type]);
     //str[type] = ["EECS 280"];
  }

  if(type != "t") {
    Parse.Cloud.run("getMorePosts", {
      classFilter: str.c,
      locationFilter: str.l,
      timeCutOff: app.refreshTime
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
  } else {
    for(var i = 0; i < str.t.length; ++i) {
      Parse.Cloud.run("getMorePosts", {
        textFilter: str.t[i],
        timeCutOff: app.refreshTime
      }, {
        success: function(response) {//text filters
          for(var j = 0; j < response.posts.length; ++j) 
            addToPosts(response.posts[j].postId, response.posts[j]);
          app.util.totalFilters--;
          if(app.util.totalFilters==0)
            updatePostUI();
        }, error: function(error) {console.log(error);}
      })
    }
  }
}

function addToPosts(id, post) {
  var report = app.user.get("reportedPosts");
  if(!(id in app.posts) && report.indexOf(id) == -1)
    app.posts[id] = post;
}

function updatePostUI() {
  app.util.lastPost = null;
  var order = new BST(postOrdering);
  for(var id in app.posts) 
    if(app.posts.hasOwnProperty(id))
      order.insert(id);
  order.doOp(fixPostFeed);
}

function fixPostFeed(id) {
  if(!$("#postholder #"+id).length)
    createPost(app.posts[id], "recent", true, app.util.lastPost);
  app.util.lastPost = id;
}





// function getFilterPosts1(ib, fs, ft) {
//  //  console.log(ib);
//   var filters = [];
//   if(ib) {
//     filters = app.user.get("filters");
//     app.filters = {};
//     app.filters.c = [];
//     app.filters.l = [];
//     app.filters.t = [];
//   }
//   app.t = 0;
//   app.t1 = app.postOrder.length;
//   //app.filters = app.user.get("filters");
//   for(var x = 0; x < (ib?filters.length:1); ++x) {
//     var filtObj;
//     if(ib) {
//       filtObj = app.user.get("filters")[x].split("|");
//       app.filters[filtObj[1]].push({filter:filtObj[0],on:false}); 
//     }
//     var report = app.user.get("reportedPosts") || [];
//     //app.filters.push(JSON.parse(filters[x]));
//    //if(ib) console.log(filtObj[0], filtObj[1]);
//     Parse.Cloud.run("getPosts", {
//       nextTen:false,
//       areFilters:true,
//       filterString:(ib?filtObj[0]:fs),
//       filterType:(ib?filtObj[1]:ft)
//     }, {
//       success: function(response) {
//         for(var i = 0; i < response.posts.length; ++i) {
//           if(report.indexOf(response.posts[i].postId) == -1) {
//             if(!(response.posts[i].postId in app.posts)) {
//               app.postOrder.push(response.posts[i].postId);
//               app.posts[response.posts[i].postId] = response.posts[i];
//               app.posts[response.posts[i].postId].filters = [];
//               if(!ib)console.log("made new post");
//             }
          
//           // console.log(report);
//           // console.log(report.indexOf(app.postOrder[app.postOrder.length-1]));
//           //console.log(response.filterString, response.posts[i].postId);
//           app.posts[response.posts[i].postId].filters.push(response.filterString.replace(/\s+/g, "_"));
//           } 
//         } 
//         ++app.t;
//         if(app.t == app.user.get("filters").length || !ib) {
//           fixPosts();
//           refreshPostFeed(false);
//           if(ib) buildFilters();
//         }
//       }, error: function(error) {console.log(error);}
//     });
//   }
// }

// function fixPosts() {
//   //order in terms of time
//   if(app.t1 < app.postOrder.length)
//     for(var i = app.t1; i < app.postOrder.length; ++i) {
//       var postTime = app.posts[app.postOrder[i]].time;
//       for(var j = i-1; j >= 0; --j) {
//         if(app.posts[app.postOrder[j]].time < postTime) {
//           temp = app.postOrder[i];
//           app.postOrder[i] = app.postOrder[j];
//           app.postOrder[j] = temp;
//         }
//       }
//     }
// }

// function refreshPostFeed(append, glow) {
//   var reports = app.user.get("reportedPosts") || [];
//   //console.log(reports);
//   for(var i = 0; i < app.postOrder.length; ++i) {
//     if($("#postholder #"+app.postOrder[i]).length == 0) {
//       //console.log("creating "+app.postOrder[i]);
//       if(i != 0 && !glow) {
//         createPost(app.posts[app.postOrder[i]], app.posts[app.postOrder[i]].filters.join(" "),append,app.postOrder[i-1], glow);
//       } else {
//         console.log("will append: "+append);
//         createPost(app.posts[app.postOrder[i]], app.posts[app.postOrder[i]].filters.join(" "),append,"top",glow);
//       }
//     } else {
//       for(var j = 0; j < app.posts[app.postOrder[i]].filters.length; ++j) {
//         if(!($("#"+app.postOrder[i]).hasClass(app.posts[app.postOrder[i]].filters[j])))
//           $("#"+app.postOrder[i]).addClass(app.posts[app.postOrder[i]].filters[j]);
//       }
//     }
//   }
//   for(var k = 0; k < reports; ++k) {
//     $("#postholder #"+reports[k]).remove();
//   }
// }

function buildFilters() {
  for(var n = 0; n < app.filters.c.length; ++n) createFilter(app.filters.c[n].filter, "|c");
  for(var o = 0; o < app.filters.l.length; ++o) createFilter(app.filters.l[o].filter, "|l");
  for(var p = 0; p < app.filters.t.length; ++p) createFilter(app.filters.t[p].filter, "|t");
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

function filterObject(s) {
  this.filter = s; //with spaces (UI display)
  this.id = s.replace(/\s+/g, "_"); //with underscores (attr)
  this.on = false;
}

$("a#logout").click(function (e) {
    e.preventDefault();
    //alert("ehh");
    Parse.User.logOut();
    console.log("logging out");
    window.location.href = "http://sartechb.github.io/WebsiteTest/login.html";
});

$('[data-toggle="tooltip"]').tooltip();

