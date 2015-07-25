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
//Get the activePosts, and locations/classes for post create autocomplete 
function buildInitialData() {
  Parse.Cloud.run("getInitialData", {}, {
    success: function (response) {
      //console.log(response);
      app.activePosts = {};
      for(var j = 0; j < response.activePosts.length; ++j) 
        app.activePosts[response.activePosts[j].postId] = 
          response.activePosts[j].title;

      for(var i = 0; i < response.activePosts.length; ++i)
        createActiveLink(response.activePosts[i].title, response.activePosts[i].postId);

      setActivePostHandler();
    }, error: function(error){console.log(error);}
  });
}

function buildDetailView() {
	Parse.Cloud.run("getDetailView", {postId:app.thisPost}, {
		success: function (response) {
      $("#loader").remove();
      createDetailPost(response);
      app.thisPostData = response;
      applyDeletePostHandler();
      applyLeavePostHandler();
		}, error: function (error) {console.log(error);}	
	});
}

function createDetailPost(post) {
  var to_insert = $("#template-post").clone(true);
  to_insert.removeClass("template-post").addClass("detail-post");
  to_insert.find("#title h1").html(post.title);
  to_insert.find("#title img").attr("src", "assets/"+post.authorPic);
  to_insert.find("#postDetails h7").html(post.author+
    " | <i class=\"fa fa-clock-o\"></i> "+prettyTime(new Date(post.time))+(
    post.isUserAuthor?" | <i class='fa fa-pencil'></i><span class='edit-post'> Edit</span>":""));
  to_insert.find("#posttext h5").html(post.content);
   to_insert.find("#lowerDetails h7").html("<span class='post-class'><i class='fa fa-book'></i> "+
    post.classString+"</span> | <span class='post-location'><i class='fa fa-location-arrow'></i> "+
    post.location+(post.detailLocation.length>0?" ("+post.detailLocation+")":"")+"</span>");
  to_insert.find("#following h7").html(post.memberCount+(post.memberCount==1?" member":" members")+" joined so far");
  to_insert.attr("id", post.postId);
  for(var i = 0; i < post.participants.length; ++i) {
    var person = to_insert.find("#parts .template-participant").clone(true);
    person.find("img").attr("src", "assets/"+post.participants[i].pic);
    person.find("h3").text(post.participants[i].name);
    person.removeClass("template-participant");
    to_insert.find("#parts").append(person);
  }
  if(post.isUserAuthor) {
    to_insert.find("div.report-me").remove();
    to_insert.find(".join").text("Delete Group");
    to_insert.find(".join").removeClass("join btn-primary").addClass("delete btn-danger");
  } else {
    to_insert.find(".join").text("Leave Group");
    to_insert.find(".join").removeClass("join btn-primary").addClass("leave btn-danger");
  }
    $("#postholder").append(to_insert);
}

function setActivePostHandler() {
  $("#active-posts div.row .active-post").click(function (e) {
    var link = $(e.target);
    if(link.prop("tagName") == "H3")
      link = link.parent();

    var postId = link.attr("id");
    var title = app.activePosts[postId];

    var url = 
    //"file:///Users/gapoorva/Documents/sandbox/trunk/Dev/StudybuddyTest/WebsiteTest/post.html";
     "http://sartechb.github.io/WebsiteTest/post.html";
    url += "#"+postId;
    window.location.href = url;
    location.reload();
   
  });
}

function applyDeletePostHandler() {
  $(".post .delete").click(function (e) {
    alert("NEED TO IMPLEMENT OK??");
  });
}

function applyLeavePostHandler() {
  $(".post .leave").click(function (e) {
    Parse.Cloud.run("leavePost", {postId:app.thisPost}, {
      success: function (response) {
        var url = 
          //"file:///Users/gapoorva/Documents/sandbox/trunk/Dev/StudybuddyTest/WebsiteTest/index.html";
           "http://sartechb.github.io/WebsiteTest/";
        window.location.href = url;
      }, error: function(error) {console.log(error);}
    });
  });
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
