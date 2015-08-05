Parse.initialize("MQvT5Bq6CsU34IQBfop8fPEJLOsLybDgDMBRdFhM", "HNFXaE7aCayggyI8hyUvbk5kG2sWXH2FpMirSNyC");

var app = {};

//Store the current User
app.user = Parse.User.current();

console.log(window.location.hash.substr(1));

if(app.user == null) {
	window.location.href = "http://sartechb.github.io/WebsiteTest/login.html";
} else if (!window.location.hash.length) {
	window.location.href = "http://sartechb.github.io/WebsiteTest/index.html";
} 

app.thisPost = window.location.hash.substr(1);

console.log(app.user);

$("#user-name h1").html(app.user.get("name"));

$("img#user-photo").attr("src", "assets/"+app.user.get("pic"));

app.util = {};

handleResize();
var resizeTimer;
$(window).resize(function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(handleResize, 250);
});
//buildPostFeed(true);
buildInitialData();
buildDetailView();
setTimeout(runUpdates, 40000);//run updates in 40 seconds
//Get the activePosts, and locations/classes for post create autocomplete 
function buildInitialData() {
  Parse.Cloud.run("getInitialData", {}, {
    success: function (response) {
      //console.log(response);
      app.locations = response.locations;
      app.classes = response.classes;
      $("#new-post-bar #new-post-place").typeahead({source: response.locations});
      $("#new-post-bar #new-post-class").typeahead({source: response.classes});
      app.activePosts = {};
      for(var j = 0; j < response.activePosts.length; ++j) 
        app.activePosts[response.activePosts[j].postId] = 
          response.activePosts[j].title;

      for(var i = 0; i < response.activePosts.length; ++i)
        createActiveLink(response.activePosts[i].title, response.activePosts[i].postId);

       $("#user-school h3").html(response.name);

      setActivePostHandler();
    }, error: function(error){console.log(error);}
  });
}

function buildDetailView() {
  app.refreshTime = new Date();
	Parse.Cloud.run("getDetailView", {postId:app.thisPost}, {
		success: function (response) {
      $("#loader").remove();
      createDetailPost(response);
      app.thisPostData = response;
      //applyDeletePostHandler();
      //applyLeavePostHandler();
		}, error: function (error) {
      //console.log(error);
      $("#loader").remove();
      $("#postholder #empty-feed").fadeIn(200);
    }	
	});
}

function createDetailPost(post) {
  var to_insert = $("#template-post").clone(true);
  to_insert.removeClass("template-post").addClass("detail-post");
  to_insert.find("#title h1").html(post.title);
  to_insert.find("#title img").attr("src", "assets/"+post.authorPic);
  to_insert.find("#postDetails h7").html(post.author+
    " | <i class=\"fa fa-clock-o\"></i> "+prettyTime(new Date(post.time))+(
    post.isUserAuthor?" | <i class='fa fa-pencil'></i>"+
    "<span class='edit-post' data-toggle='modal' data-target='#editModal'> Edit</span>":""));
  to_insert.find("#posttext h5").html(post.content);
  to_insert.find("#lowerDetails h7").html("<i class='fa fa-book'></i> "+
    post.classString+" | <i class='fa fa-location-arrow'></i> "+
    post.location+(post.detailLocation.length>0?" ("+post.detailLocation+")":""));
  to_insert.find("#following h7").html(post.memberCount+(post.memberCount==1?" member":" members")+
    " joined so far");
  to_insert.attr("id", post.postId);
  for(var i = 0; i < post.participants.length; ++i) {
    var person = to_insert.find("#parts .template-participant").clone(true);
    person.find("img").attr("src", "assets/"+post.participants[i].pic);
    person.find("h3").text(post.participants[i].name);
    person.removeClass("template-participant");
    to_insert.find("#parts").append(person);
  }
  if(post.hasUserJoined)
    if(post.isUserAuthor) {
      to_insert.find("div.report-me").remove();
      to_insert.find(".leave").remove();
      to_insert.find(".join").remove();
    } else {
      to_insert.find(".delete").remove();
      to_insert.find(".join").remove();
    }
  else {
    to_insert.find(".delete").remove();
    to_insert.find(".leave").remove();
  }

  $("#postholder").append(to_insert);
  $("#template-post").remove();

  applyEditPostHandler();
}

function setActivePostHandler() {
  $("#active-posts div.row .active-post").click(function (e) {
    var link = $(e.target);
    if(link.prop("tagName") == "H3")
      link = link.parent();

    var postId = link.attr("id");
    var title = app.activePosts[postId];
    window.location.href = "post.html#"+postId;
    location.reload();
   
  });
}

//COMMENTING LOGIC
$("form#comment").submit(function (e) {
  e.preventDefault();
  var content = $("#comment-text")[0].value;
  console.log($("#comment-text"),content, e);
  Parse.Cloud.run("makeComment", {
    comment: content,
    postId: app.thisPost
  }, {
    success: function(response) {
      console.log(response);
    }, error: function(error) {console.log(error);} 
  });
});


$(".post .join").click(function (e) {
    Parse.Cloud.run("joinPost", {postId:app.thisPost}, {
      success: function(response) {
        console.log(response);
        if(response.success) {
          location.reload();
        } else {//member limit reached
          var modal = $("#joinFailure.modal");
          var postData = app.thisPostData;
          modal.find("span.post-owner-name").text(postData.author);
          if(postData.memberLimit>1)
            modal.find("span.limit").text(postData.memberLimit+" people");
          else
            modal.find("span.limit").text(postData.memberLimit+" person");
          modal.modal("show");
        }
      }, error: function(error) {console.log(error);}
    });
  }); 


$("#deletePostConf .delete").click(function (e) {
  Parse.Cloud.run("deletePost", {postId:app.thisPost}, {
      success: function (response) {
        if(response.success) {
          window.location.href = "index.html";
        } else {
          console.log("an error occurred when deleting the post");
        }
      }, error: function(error) {console.log(error);}
    });
});

$("#leavePostConf .leave").click(function (e) {
  Parse.Cloud.run("leavePost", {postId:app.thisPost}, {
      success: function (response) {
        var url = 
          //"file:///Users/gapoorva/Documents/sandbox/trunk/Dev/StudybuddyTest/WebsiteTest/index.html";
           "index.html";
        window.location.href = url;
      }, error: function(error) {console.log(error);}
    });
  });

function applyEditPostHandler() {
  $(".edit-post").click(function () {
    $("#editModal .notify").hide();
   // console.log("edit post opened");
    var m = $("#editModal #createpost");

    m.find("#new-post-title").val(app.thisPostData.title);
    m.find("#new-post-content").val(app.thisPostData.content);
    m.find("#new-post-place").val(app.thisPostData.location);
    m.find("#new-post-class").val(app.thisPostData.classString);
    m.find("#new-post-detail").val(app.thisPostData.detailLocation);
  });
}

$("#editModal .save").click(function () {
  var m = $("#editModal #createpost");
  var errorAlert = "<div class='alert alert-danger fade in col-xs-10 col-xs-offset-2'><a href='#'' "+
    "class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
  var edits = {};
  edits.title =  m.find("#new-post-title").val();
  edits.content = m.find("#new-post-content").val();
  edits.baseLocation =  m.find("#new-post-place").val();
  edits.detailLocation =  m.find("#new-post-detail").val();
  edits.classString =  m.find("#new-post-class").val();

  var reqFields = edits.title.length?true:false &&
    edits.content.length?true:false &&
    edits.baseLocation.length?true:false &&
    edits.detailLocation.length?true:false &&
    edits.classString.length?true:false;

  //make content checks
  if(edits.title.length > 150) {
   if($("#createpost").find("div.alert.alert-danger").length == 0)
      $("#createpost").prepend(errorAlert+"Your title is too long! Try to make it more concise.</div>");
    return;
  } else if(edits.content.length > 450) {
    if($("#createpost").find("div.alert.alert-danger").length == 0)
      $("#createpost").prepend(errorAlert+"Your message is too long! Try to make it more concise.</div>");
    return;
  } else if (!reqFields) {
    if($("#createpost").find("div.alert.alert-danger").length == 0)
      $("#createpost").prepend(errorAlert+"Whoops you missed something above! Try again.</div>");
    return;
  }

  //can't be a new location or post we didn't save
  if(app.locations.indexOf(edits.baseLocation) == -1) {
    if($("#createpost").find("div.alert.alert-danger").length == 0)
      $("#createpost").prepend(errorAlert+"Sorry! No one has added that location to Wobetto yet. Usually, we let you mark new locations when you make new posts. Since you're editing a post you made, you'll have to select a location already available or make a new post.</div>");
    return;
  }else if(app.classes.indexOf(edits.classString) == -1) {
    if($("#createpost").find("div.alert.alert-danger").length == 0)
      $("#createpost").prepend(errorAlert+"Sorry! No one has added that class to Wobetto yet. Usually, we let you add new classes when you make new posts. Since you're editing a post you made, you'll have to select a class already available or make a new post.</div>");
    return;
  }

  $("div.alert").alert("close");

  edits.postId = app.thisPost;

  Parse.Cloud.run("editPost", edits, {
    success: function (response) {
      var thePost = $("#postholder .post");
      thePost.find("#title h1").text(edits.title);
      thePost.find("#posttext h5").text(edits.content);
      thePost.find("#lowerDetails h7").html("<i class='fa fa-book'></i> "+
        edits.classString+" | <i class='fa fa-location-arrow'></i> "+
        edits.baseLocation+(edits.detailLocation.length>0?" ("+edits.detailLocation+")":""));

      app.thisPostData.title = edits.title;
      app.thisPostData.content = edits.content;
      app.thisPostData.location = edits.baseLocation;
      app.thisPostData.detailLocation = edits.detailLocation;
      app.thisPostData.classString = edits.classString;

      $("#editModal .notify").fadeIn(200);
      setTimeout(function() {
        $("#editModal .notify").fadeOut(200);
      }, 3000);
    }, error: function(error) {console.log(error);}
  });
});

function runUpdates() {
  //get the posts that were recently made and order them and build them

  var queryUpdate = new Parse.Query(Parse.object.extend("Update"));
  queryUpdate.greaterThan("createdAt", app.refreshTime);
  queryUpdate.equalTo("post", app.thisPost);
  queryUpdate.find({
    success: function(update) {
      for(var i = 0; i < update.length; ++i) {
        var type = update[i].type;
        if(type == "post-title") {
          
        }
      }
    }, error: function(error) {console.log(error);}
  });

  //get update objects and apply changes
  //TO-DO

  setTimeout(runUpdates, 40000);
}



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

$("a#logout").click(function (e) {
    e.preventDefault();
    //alert("ehh");
    Parse.User.logOut();
    console.log("logging out");
    window.location.href = "http://sartechb.github.io/WebsiteTest/login.html";
});
