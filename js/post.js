//Allows autogrow on textarea for post creation
$("#new-post-content").autogrow();

//Event handler for post creation
$('#new-post-bar h2.untoggle').on('click', function (e) {
  var bar = $(e.target);
  bar = bar.parent();
  var form = $("#new-post");
  //check for minimized state and expand
  if(bar.hasClass('minimized')) {
    form.children().show({"duration":300,"easing":"easeInOutQuad"});
    bar.removeClass('minimized').addClass('expanded');
  }
  //give focus to first input
  $("#createpost #new-post-title").focus();
  //allows post creation box to stay open
});

//Event handler for form submission
$('#new-post').submit(function (e) {
  e.preventDefault();
  console.log(e);
  var ct = e.currentTarget;

  var errorAlert = "<div class='alert alert-danger col-xs-8 col-xs-offset-2'><a href='#'' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
  var input_length = $("#createpost input, #createpost textarea").length;
  for(var i = 0; i < input_length; ++i) {//iterate through all inputs
    if(ct[i].value == "") {//if any are empty
      if($("#createpost").find("div.alert.alert-danger").length == 0) //show an error if there isn't one...
        $("#createpost").append(errorAlert+"Oops! You missed something above...</div>");
      return;//...don't submit anything
    }
  }// end for: All inputs were submitted

  //the following lines demonstate data access. Can create an object to pass to Cloud here
  //TODO: integrate with Parse.Cloud here!!
  for(var i = 0; i < input_length; ++i)
    console.log(ct[i].value);

  //Fill in a post template and post it
  // createPost(ct[0].value, ct[1].value, Parse.User.current().get("name"), 
  //   ct[2].value, ct[3].value.toUpperCase().trim(), "Now", "parseID");
  var post = {};
  post.memberLimit = parseInt(ct[4].value);
  post.content = ct[1].value;
  _class = ct[3].value.toUpperCase().split(" ");
  //console.log(_class);
  post.Class = _class[0].toUpperCase().trim();
  post.classNumber = parseInt(_class[1].trim());
  post.title = ct[0].value;
  post.deletionDate = new Date();
  post.location = ct[2].value;

  Parse.Cloud.run("makePost", post, {
    success: function(response) {
      createPost(response.title, response.content, response.poster, response.location,
        response.Class+" "+response.classNumber, response.createdAt, response.objectId);
      app.posts.push(response);
      var filterId = _class.join("_");
      for(var n = 0; n < app.filters.length; ++n) {
        if(app.filters[n].length != 0) {
          app.filters[n].push(response.objectId);
        }
      }
    },
    error: function(response) {
      console.log(response);
    }
  });

  //clean up the post creator
  for(var i = 0; i < input_length; ++i)
    e.currentTarget[i].value = '';
  $("#new-post").children().hide(300);
  $("#new-post-bar").addClass('minimized').removeClass('expanded');

  

  filterAll();
});

function createPost(title, content, author, location, className, time, id) {
  var to_insert = $("#template-post").clone(true);
  to_insert.find("#title h1").html(title);
  to_insert.find("#postDetails h7").html(author+" | "+time);
  to_insert.find("#posttext h5").html(content);
  to_insert.find("#lowerDetails h7").html(className+" | "+location);
  to_insert.attr("id", id);
  to_insert.removeClass("template-post");
  $("#postholder").prepend(to_insert);
  filt = className.replace(" ","_");
  //ISSU HERE WITH UNINTENDED FILTER CREATION
  // if(app.filters[filt] != null)
  //   app.filters[filt].push(id);
  // else 
  //   app.filters[filt] = [id];
}

//Cancel logic for post creation
$("#post-cancel").click(function (e) {
  $("#new-post input, #new-post textarea").val("");
  $("#new-post").children().hide(300, function() {
    $("#new-post-bar").addClass('minimized').removeClass('expanded');
  });
  //
  //setTimeout(function(){$("#new-post-bar").addClass('minimized').removeClass('expanded');}, 200);
});

function createActiveLink(title) {
  var to_insert = $("#active-posts .template-active-post").clone();
  to_insert.removeClass("template-active-post");
  to_insert.find("h3").html(title);
  console.log(title);
  //add src attribute creation here
  $("#active-posts div.row").append(to_insert);
}