// Controls dropdown code
$('#dropdown').on('click', function(){
  if($(window).width() > 768)
  {
  $('#sidebar').slideToggle(200);
  if($('#content').hasClass('col-md-10'))
  {
   $('#content').switchClass( "col-md-10", "col-md-12", 200, "easeInOutQuad" );
   $('#content').switchClass( "col-sm-10", "col-sm-12", 200, "easeInOutQuad" ); 
  }
  else if($('#content').hasClass('col-md-12'))
  {
    $('#content').switchClass( "col-md-12", "col-md-10", 200, "easeInOutQuad" ); 
    $('#content').switchClass( "col-sm-12", "col-sm-10", 200, "easeInOutQuad" ); 
  }
 
}
else
{

  if($('#sidebar').hasClass('hidden-xs'))
  {
    $('#content').slideToggle(200);
    $('#sidebar').delay(200).switchClass( "hidden-xs", "col-xs-12", 0, "swing" );
    $('#actions').slideToggle(200); 
  }
  else{
    $('#sidebar').switchClass( "col-xs-12", "hidden-xs", 200, "swing" ); 
    $('#content').delay(200).slideToggle(200);
     $('#actions').slideToggle(200);
  }
}
});


//allows for separate scrolling or side bar and body
$('body').scroll(function() { 
  $('#sidebar').css('top', $(this).scrollTop());
});


//Active Post things
function setActivePostHandler() {
  $("#active-posts div.row a").click(function (e) {
    var link = $(e.target);
    link = link.closest("a");
    window.location.href = link.attr("href");
    if(app.thisPost)
      location.reload();

   //  if(link.prop("tagName") == "H3")
   //    link = link.parent();

   //  var postId = link.attr("id");
   //  var title = app.activePosts[postId];

   //  var url = 
   // // "file:///Users/gapoorva/Documents/sandbox/trunk/Dev/StudybuddyTest/WebsiteTest/post.html";
   //  "post.html";
   //  url += "#"+postId;
   //  window.location.href = url;
  });
}

function buildNotifications(append,array) {
  var count = parseInt($(".notifications .badge").text()) || 0;
  if(array.length) {
    var start = count;
    $("#notificationfeed ul li.noNew").fadeOut(200);
    for (var i = 0; i < array.length;++i) {
      var note = $(".template-note").clone(true);
      note.removeClass("template-note");
      note.find("a").text(array[i].text+" | "+prettyTime(array[i].time));
      if(array[i].viewed) 
        note.removeClass("new");
      else 
        count++;
      note.attr("id", array[i].id);
      if(append)
        $("#notificationfeed ul").append(note);
      else
        $("#notificationfeed ul").prepend(note);
      if(count - start)
        document.getElementById('audiotag1').play();
    }
    if(count) {
      $(".notifications .badge").text(count);
    }
  }
}

$(".notifications").click(function (e) {
    var feed = $("#notificationfeed");
    if(feed.hasClass("open")) {
      feed.fadeOut(200);
      feed.removeClass("open");
      $(".notifications .badge").text("");
    } else {
      feed.addClass("open");
      feed.fadeIn(200);
    }
});

$("#notificationfeed ul li a").click(function (e) {
  
  console.log("preventing");
  var note = $(e.target).parent();
  console.log(note.attr("id"));
  var query = new Parse.Query(Parse.Object.extend("Notification"));
  query.get(note.attr("id"), {
    success: function(noti) {
      noti.set("viewed", true);
      noti.save(null,{
        success: function(){
          if(noti.get("targetPost") == app.thisPost)
            location.reload();
          window.location = "post.html#"+noti.get("targetPost");
          if(app.thisPost)
            location.reload();
        }
      });
      
    }, error: function(error) {console.log("error");}
  });
});
