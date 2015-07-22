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
  });
}