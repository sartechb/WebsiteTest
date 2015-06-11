// $( '.filter-class' ).on( 'click', 'input:checkbox', function () {
//   if((this).value === "showall")
//   {
//     $(".post").show();    
//     $(".filtered").removeClass("filtered");
//   }
//   else{
//     $(".post").hide();
//     $(".filtered").removeClass("filtered");
//     $(this).parent().addClass("filtered");
//     $(document.getElementById((this).value)).show(); 
//   }
// });

/*
 * The app variable will be a global application variable.
 * One can use the app variable to save debug data and
 * view it at the console. It also helps the app maintain
 * state for uses like filtering.
 */
var app = {};

/*
 * How this works: we initialize important page elements
 * like the name, uni, etc in this function. We add filter
 * data to the app variable based on information we get from
 * parse. It's set up so each filter has it's own array of post
 * IDs that it corresponds to. This makes it easy to hide
 * and show the correct posts, and all this info is 
 * maintained and manipulated internally
 */

  //building filters
  app.filters = {};

  //replace this part with info taken from parse:
  //TODO: PARSE INTEGRATION HERE
  app.filters["EECS_370"] = [];
  app.filters["EECS_475"] = [];
  app.filters["EECS_485"] = [];
  app.filters["LING_341"] = [];

  //building post mappings
  //replace this part with info taken from parse:
  //TODO: PARSE INTEGRATION HERE
  app.filters["EECS_370"].push("dummy123", "eecs370");
  app.filters["EECS_475"].push("eecs475");
  app.filters["EECS_485"].push("eecs485");
  app.filters["LING_341"].push("ling341");

  console.log(app);


$(".filter-class div").on("click", function (e) {filterToggle(e);});
$("div.showall").on("click", function (e) {
  $(".post.on").removeClass(".on");
  $(".post").not(".template-post").show();
});

function filterToggle(e) {
  var filter = $(e.target).parent().attr("id");
  console.log(e.target);
  filterToggleHelper(filter);
}


function filterToggleHelper (filter) {
  console.log(filter);
  var a = app.filters[filter];
  for(var i=0; i < a.length; ++i) 
    if($("#"+a[i]).hasClass("on"))
      $("#"+a[i]).removeClass("on");
    else
      $("#"+a[i]).addClass("on");
  $(".post").not(".template-post").show();
  if($(".post.on").length != 0)
    $(".post").not(".on").hide();
}


$('#dropdown').on('click', function(){
  $('#sidebar').slideToggle(200);
  if($('#content').hasClass('col-xs-10'))
  {
   $('#content').switchClass( "col-xs-10", "col-xs-12", 200, "easeInOutQuad" );
  }
  else
  {
    $('#content').switchClass( "col-xs-12", "col-xs-10", 200, "easeInOutQuad" ); 
  }
});

//allows for separate scrolling or side bar and body
$('body').scroll(function() { 
  $('#sidebar').css('top', $(this).scrollTop());
});

//Allows autogrow on textarea for post creation
$("#new-post-content").autogrow();

//Event handler for post creation
$('#new-post-bar h2.untoggle').on('click', function (e) {
  var bar = $(e.target);
  bar = bar.parent();
  //check for minimized state and expand
  if(bar.hasClass('minimized')) 
    bar.removeClass('minimized').addClass('expanded');
  //give focus to first input
  $("#createpost #new-post-title").focus();
  //allows post creation box to stay open
});

//Event handler for form submission
$('#new-post').submit(function (e) {
  e.preventDefault();
  console.log(e);

  var errorAlert = "<div class='alert alert-danger col-xs-8 col-xs-offset-2'><a href='#'' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
  var input_length = $("#createpost input, #createpost textarea").length;
  for(var i = 0; i < input_length; ++i) {//iterate through all inputs
    if(e.currentTarget[i].value == "") {//if any are empty
      if($("#createpost").find("div.alert.alert-danger").length == 0) //show an error if there isn't one...
        $("#createpost").append(errorAlert+"Oops! You missed something above...</div>");
      return;//...don't submit anything
    }
  }// end for: All inputs were submitted

  //the following lines demonstate data access. Can create an object to pass to Cloud here
  //TODO: integrate with Parse.Cloud here!!
  for(var i = 0; i < input_length; ++i)
    console.log(e.currentTarget[i].value);

  //Fill in a post template and post it
  var templates = $("#postholder div.post.template-post").length-1;
  var post = $("#template-post-"+templates);
  post.find("#title h1").html(e.currentTarget[0].value);
  post.find("#postDetails h7").html("StudyMan BuddySon | Now");//need to replace with actual data and PrettyTime fn
  post.find("#posttext h5").html(e.currentTarget[1].value);
  post.find("#lowerDetails h7").html("+join | "+e.currentTarget[2].value+" | "+e.currentTarget[3].value);
  post.removeClass("template-post");
  post.attr("id", "parseidgoeshere");//replace with parse generated id


  //clean up the post creator
  for(var i = 0; i < input_length; ++i)
    e.currentTarget[i].value = '';

  $("#new-post-bar").addClass('minimized').removeClass('expanded');

});

