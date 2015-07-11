//Allows autogrow on textarea for post creation
$("#new-post-content").autogrow();

//Event handler for post creation
$('#new-post-bar h2.untoggle').on('click', function (e) {
  var bar = $(e.target);
  bar = bar.parent();
  var form = $("#new-post");
  //check for minimized state and expand
  if(bar.hasClass('minimized')) {
    form.children().fadeIn({"duration":300,"easing":"easeInOutQuad"});
    bar.removeClass('minimized').addClass('expanded');
  }
  //give focus to first input
  $("#createpost #new-post-title").focus();
  //allows post creation box to stay open
});

app.newLocationString = {val:"",is:false};
app.newClassString = {val:"",is:false};

$("#new-post").submit(function (e) {
  e.preventDefault();
  var errorAlert = "<div class='alert alert-danger col-xs-8 col-xs-offset-2'><a href='#'' "+
    "class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
  var titleLength = $("#new-post-bar #new-post-title").val().length;
  var contentLength = $("#new-post-bar #new-post-content").val().length;
  var reqFields = $("#new-post-bar #new-post-title").val().length > 0 &&
    $("#new-post-bar #new-post-content").val().length > 0 &&
    $("#new-post-bar #new-post-place").val().length > 0 &&
    $("#new-post-bar #new-post-class").val().length > 0;
  if(titleLength > 150) {
   if($("#createpost").find("div.alert.alert-danger").length == 0)
      $("#createpost").append(errorAlert+"Your title is too long! Try to make it more concise.</div>");
    return;
  } else if(contentLength > 450) {
    if($("#createpost").find("div.alert.alert-danger").length == 0)
      $("#createpost").append(errorAlert+"Your message is too long! Try to make it more concise.</div>");
    return;
  } else if (!reqFields) {
    if($("#createpost").find("div.alert.alert-danger").length == 0)
      $("#createpost").append(errorAlert+"Whoops you missed something above! Try again.</div>");
    return;
  }

  var classString = $("#new-post-bar #new-post-class").val();
  var locationString = $("#new-post-bar #new-post-place").val();

  if(app.locations.indexOf(locationString) == -1 && app.newLocationString != locationString) {
    app.newLocationString.val = "";
    app.newLocationString.is = false;
    $("#newLocationStringMenu span.user-entry").html(locationString);
    $("#newLocationStringMenu").modal("show");
    return;
  }else if(app.classes.indexOf(classString) == -1) {
    app.newClassString.val = "";
    app.newClassString.is = false;
    $("#newClassStringMenu span.user-entry").html(classString);
    $("#newClassStringMenu").modal("show");
    return;
  }

  var newPost = {};
  newPost.isNewLocation = app.newLocationString.is;
  newPost.isNewClass = app.newClassString.is;
  newPost.post = {};
  newPost.post.title = $("#new-post-bar #new-post-title").val();
  newPost.post.content = $("#new-post-bar #new-post-content").val();
  newPost.post.classString = $("#new-post-bar #new-post-class").val();
  newPost.post.baseLocation = $("#new-post-bar #new-post-place").val();
  newPost.post.detailLocation = $("#new-post-bar #new-post-detail").val();
  if($("#new-post-bar #new-post-limit").val().length != 0)
    newPost.post.memberLimit = parseInt($("#new-post-bar #new-post-limit").val());
  else
    newPost.post.memberLimit = 5;

  Parse.Cloud.run("createPost", newPost, {
    success: function (response) {
      newPost.post.postId = response.postId;
      newPost.post.time = response.time;
      newPost.post.authorPic = app.user.get("pic");
      newPost.post.author = app.user.get("name");
      newPost.post.memberCount = 1;
      newPost.post.filters = [];
      newPost.post.location = newPost.post.baseLocation;
      app.posts[newPost.post.postId] = newPost.post;
      app.postOrder.push(newPost.post.postId);
      fixPosts();
      refreshPostFeed(false, true);
      $("#post-cancel").trigger("click");

      
    }, error: function (error) {console.log(error);}
  });

});

$("#newLocationStringMenu").on("show.bs.modal", function (e){
  $("#newLocationStringMenu .notice").hide();
});

$("#newLocationStringMenu #newLocationStringAdd").submit(function (e) {
  e.preventDefault();
  var reqFields = $("#newLocationStringAdd #newLocationStringLong").val().length > 0 &&
    $("#newLocationStringAdd #newLocationStringShort").val().length > 0;
  if (!reqFields) {
    $("#newLocationStringMenu .notice").fadeIn(200);
    setTimeout(function(){$("#newLocationStringMenu .notice").fadeOut(200);}, 6000);
    return;
  } else {
    $("#newLocationStringMenu span.user-entry").html();
    app.newLocationString.val = $("#newLocationStringAdd #newLocationStringShort").val()+" "+
      $("#newLocationStringAdd #newLocationStringLong").val();
    app.locations.push(app.newLocationString.val);
    app.newLocationString.is = true;

    $("#newLocationStringMenu input[type='text']").val("");
    $("#new-post-bar #new-post-place").val(app.newLocationString.val);
    $('#newLocationStringMenu').modal('hide');
    $("#new-post").trigger("submit");
  }
});

$("#newLocationStringMenu #newLocationStringCancel").click(function() {
  $("#newLocationStringMenu input[type='text']").val("");
  app.newClassString.is = false;
  $('#newLocationStringMenu').modal('hide');
});

$("#newClassStringMenu").on("show.bs.modal", function (e){
  $("#newClassStringMenu .notice").hide();
});

$("#newClassStringMenu #newClassStringAdd").submit(function (e) {
  e.preventDefault();
  var reqFields = $("#newClassStringAdd #newClassStringLong").val().length > 0 &&
    $("#newClassStringAdd #newClassStringShort").val().length > 0;
  if (!reqFields) {
    $("#newClassStringMenu .notice").fadeIn(200);
    setTimeout(function(){$("#newClassStringMenu .notice").fadeOut(200);}, 6000);
    return;
  } else {
    $("#newClassStringMenu span.user-entry").html();
    app.newClassString.val = $("#newClassStringAdd #newClassStringShort").val()+" "+
      $("#newClassStringAdd #newClassStringLong").val();
    app.classes.push(app.newClassString.val);
    app.newClassString.is = true;

    $("#newClassStringMenu input[type='text']").val("");
    $("#new-post-bar #new-post-class").val(app.newClassString.val);
    $('#newClassStringMenu').modal('hide');
    $("#new-post").trigger("submit");
  }
});

$("#newClassStringMenu #newClassStringCancel").click(function() {
  $("#newClassStringMenu input[type='text']").val("");
  app.newClassString.is = false;
  $('#newClassStringMenu').modal('hide');
});

function createPost(post, set, append, postBefore, glow) {
  var to_insert = $("#template-post").clone(true);
  to_insert.find("#title h1").html(post.title);
  to_insert.find("#title img").attr("src", "assets/"+post.authorPic);
  to_insert.find("#postDetails h7").html(post.author+" | "+post.time.toString());
  to_insert.find("#posttext h5").html(post.content);
  to_insert.find("#lowerDetails h7").html(post.classString+" | "+post.location+" "+post.detailLocation);
  to_insert.find("#following h7").html(post.memberCount+" members have joined this post");
  to_insert.attr("id", post.postId);
  to_insert.removeClass("template-post");
  to_insert.addClass(set);
  to_insert.addClass(post.classString.replace(/\s+/g,"_"));
  to_insert.addClass(post.location.replace(/\s+/g,"_"));
  if(glow) {
    to_insert.addClass("glow");
    setTimeout(function() {$(".post.glow").removeClass("glow", 1000);}, 9000);
  }

  //time function filter here
  if(append)
    $("#postholder").append(to_insert);
  else
    if(postBefore == "top")
      $("#postholder").prepend(to_insert);
    else
      $("#postholder #"+postBefore).after(to_insert);
}

//Cancel logic for post creation
$("#post-cancel").click(function (e) {
  $("#new-post input, #new-post textarea").val("");
  $("#new-post").children().fadeOut(300, function() {
    $("#new-post-bar").addClass('minimized').removeClass('expanded');
  });
  if(!app.newLocationString.is && app.newLocationString.val.length > 0)
    if(app.locations.indexOf(app.newLocationString.val) != -1)
      app.locations.splice(app.locations.indexOf(app.newLocationString.val), 1);
  if(!app.newClassString.is && app.newClassString.val.length > 0)
    if(app.locations.indexOf(app.newClassString.val) != -1)
      app.locations.splice(app.locations.indexOf(app.newClassString.val), 1);
  //
  //setTimeout(function(){$("#new-post-bar").addClass('minimized').removeClass('expanded');}, 200);
});

function createActiveLink(title, objectId) {
  var to_insert = $("#active-posts .template-active-post").clone();
  to_insert.removeClass("template-active-post");
  to_insert.attr("id", objectId);
  to_insert.find("h3").html(title);
  //add src attribute creation here
  $("#active-posts div.row").append(to_insert);
}

