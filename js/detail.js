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
    }, error: function(error){console.log(error);}
  });
}

function buildDetailView() {
	Parse.Cloud.run("getDetailView", {postId:app.thisPost}, {
		success: function (response) {
			console.log(response);
		}, error: function (error) {console.log(error);}	
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

