Parse.initialize("MQvT5Bq6CsU34IQBfop8fPEJLOsLybDgDMBRdFhM", "HNFXaE7aCayggyI8hyUvbk5kG2sWXH2FpMirSNyC");

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
  app.filters["EECS_370"].push("eecs370");
  app.filters["EECS_475"].push("eecs475");
  app.filters["EECS_485"].push("eecs485");
  app.filters["LING_341"].push("ling341");

  //console.log(app);

  var current = Parse.User.current();
  console.log(current.get("Name"));

  $("#user-name h1").html(current.get("name"));
  $("#user-school h3").html(current.get("school"));

//sets event handlers on filters and showall
$(".filter-class div").on("click", function (e) {filterToggle(e);});
$("div.showall").on("click", function() {filterAll()});

//Applies Show All
function filterAll () {
  $(".post.on").removeClass("on");
  $(".post").not(".template-post").show(300);
  $(".filtered").removeClass("filtered");
}

//Applies filterHelper
function filterToggle(e) {
  var filter;
  if($(e.target).prop("tagName") == "H4")
    filter = $(e.target).parent();
  else filter = $(e.target);
  //console.log(e.target);
  filter.toggleClass("filtered");
  filterToggleHelper(filter.attr("id"));
  
}

//Applies filters
function filterToggleHelper (filter) {
  //console.log(filter);
  if(filter == null) return;
  var a = app.filters[filter];
 // console.log(a[0]);
  for(var i=0; i < a.length; ++i) 
    if($("#"+a[i]).hasClass("on"))
      $("#"+a[i]).removeClass("on");
    else
      $("#"+a[i]).addClass("on");

  setTimeout(function () {
    $(".post.on").not(".template-post").show(300);
    if($(".post.on").length != 0 /*&& */)
      $(".post").not(".on").hide(300);
    else if($(".filter-class .filtered").length == 0)
      $(".post").not(".template-post").show(300);
  }, 50);
  
}

// Controls dropdown code
$('#dropdown').on('click', function(){
  if($(window).width() > 768)
  {
  $('#sidebar').slideToggle(200);
  if($('#content').hasClass('col-md-10'))
  {
   $('#content').switchClass( "col-md-10", "col-md-12", 200, "easeInOutQuad" );
  }
  else if($('#content').hasClass('col-md-12'))
  {
    $('#content').switchClass( "col-md-12", "col-md-10", 200, "easeInOutQuad" ); 
  }
  else if($('#content').hasClass('col-sm-10'))
  {
   $('#content').switchClass( "col-sm-10", "col-sm-12", 200, "easeInOutQuad" );
  }
  else if($('#content').hasClass('col-md-12'))
  {
    $('#content').switchClass( "col-sm-12", "col-sm-10", 200, "easeInOutQuad" ); 
  }
  
}
else
{

  if($('#sidebar').hasClass('hidden-xs'))
  {
    $('#content').slideToggle(200);
    $('#sidebar').delay(200).switchClass( "hidden-xs", "col-xs-12", 0, "swing" ); 
  }
  else{
    $('#sidebar').switchClass( "col-xs-12", "hidden-xs", 200, "swing" ); 
    $('#content').delay(200).slideToggle(200);
  }
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
  $("#new-post").children().hide(300);
  $("#new-post-bar").addClass('minimized').removeClass('expanded');

  filterAll();
});

//Cancel logic for post creation
$("#post-cancel").click(function (e) {
  $("#new-post input, #new-post textarea").val("");
  $("#new-post").children().hide(300, function() {
    $("#new-post-bar").addClass('minimized').removeClass('expanded');
  });
  //
  //setTimeout(function(){$("#new-post-bar").addClass('minimized').removeClass('expanded');}, 200);
});

//new filter button logic. Shows newFilterModal
$("#new-filter").click(function (e) {
  showVeil();
  $("#newFilterModal").show(200);
});

//Logic for submitting a new filter and adding it to the sidebar. TODO: Parse integration here!
$("#newFilterModal form").submit(function (e) {
  e.preventDefault();
  hideVeil();
  $("#newFilterModal").hide(200);
  var newFilter = e.currentTarget[0].value;
  $("#newFilterModal input").val("");

  newFilter = newFilter.toUpperCase();
  var id = newFilter.replace(" ", "_");
  $(".filter-class").append("<div class='col-md-12' id="+id+
    "><h4><span class='glyphicon glyphicon-remove' aria-hidden='true'></span>"+newFilter+"</h4></div>");
  var html = $(".filter-class #"+id);
  console.log(html);
  html.click(function (e){filterToggle(e);});
  app.filters[id] = [];
  //connect all posts that fit under this filter here! TODO: Parse integration here!
});

//Cancel logic for new filter creation
$("#newFilterModal button.cancel").click(function (e) {
  $("#newFilterModal").hide(200);
  $("#newFilterModal input").val("");
  hideVeil();
});

//logic to delete a filter. TODO: Parse integration here!
$(".filter-class div span").click(function (e) {
  var filter = $(e.target).parent().parent();
  filter.hide(200, function (){$(this).remove();});
  //filter.remove();
  //also remove from active filter list in parse!
});

$("a#logout").click(function (e) {
  e.preventDefault();
  //alert("ehh");
  Parse.User.logOut();
  console.log("logging out");
  window.location.href = "http://sartechb.github.io/WebsiteTest/login.html";
});

//logic to show/hide veil during modals with animation
function showVeil() {$("div.veil").addClass("active", 300);}
function hideVeil() {$("div.veil.active").removeClass("active", 300);}
