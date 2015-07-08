//logic to show/hide veil during modals with animation
function showVeil() {$("div.veil").addClass("active", 300);}
function hideVeil() {$("div.veil.active").removeClass("active", 300);}

//sets event handlers on filters and showall
$(".filter-class div.filter-button").on("click", function (e) {filterToggle(e);});
$("div.showall").on("click", function() {filterAll()});

//Applies Show All
function filterAll () {
  $(".post.on").removeClass("on");
  $(".post").not(".template-post").show(300);
  $(".off").removeClass("off");
}

//Applies filterHelper
function filterToggle(e) {
  var filter;
  if($(e.target).prop("tagName") == "H6")
    filter = $(e.target).parent().parent();
  else if ($(e.target).hasClass("filter-button"))
    filter = $(e.target).parent();
  else 
    filter = $(e.target);
  console.log(e.target);
  filter.toggleClass("off");
  filterToggleHelper(filter.attr("id"));
  console.log("called filterToggle");
}

//Applies filters
function filterToggleHelper (filter) {
  console.log(filter+" from the helper");
  if(filter == null) return;
  var a = app.filters[filter];
  var postholderNF = $("#postholder.nofilter");
 //console.log(a[0]);

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

function createFilter (filter) {
  var to_insert = $("div.filter-class div.template-filter").clone(true);
  //console.log(to_insert, "this is the created filter");
  to_insert.removeClass("template-filter");
  to_insert.attr("id", filter.replace(" ","_"));
  to_insert.find("h6").append(filter);
  $("div.filter-class").append(to_insert);
}

//new filter button logic. Shows newFilterModal
$("#new-filter").click(function (e) {
  showVeil();
  $("#newFilterModal").show(200);
  $("#newFilterModal input").focus();
});

//Logic for submitting a new filter and adding it to the sidebar. TODO: Parse integration here!
$("#newFilterModal form").submit(function (e) {
  e.preventDefault();
  hideVeil();
  $("#newFilterModal").hide(200);
  var newFilter = e.currentTarget[0].value.toUpperCase().trim();
  var filterId = newFilter.replace(" ","_");
  $("#newFilterModal input").val("");

  if(app.filters[filterId] == undefined) {
    console.log("was undefined");
    newFilter = newFilter.toUpperCase();
    createFilter(newFilter);
    app.filters[filterId] = [];

    Parse.Cloud.run("makeFilter", 
    {
      type: "CLASS_CLASSNUMBER",
      Class: newFilter.split(" ")[0],
      classNumber: parseInt(newFilter.split(" ")[1])
    },
    {
      success: function(r) {
        for(var i = 0; i < r.relevantPosts.length; ++i) {
          console.log(r.relevantPosts[i]);
          app.filters[filterId].push(r.relevantPosts[i]);
        }
        console.log(app.filters[filterId]);
      }, error: function(r) {console.log(r);}
    });


    // for(var x = 0; x < app.posts.length; ++x) {
    // name = app.posts[x].Class+"_"+app.posts[x].classNumber;
    //   if(filterId == name) {
    //     if(app.filters[filterId] == undefined) 
    //       app.filters[filterId]=[];
    //     else if($.inArray(app.posts[x].objectId, app.filters[filterId]) == -1)
    //       app.filters[filterId].push(app.posts[x].objectId);
    //   }
    // }
  }
  //app.filters[newFilter.replace(" ","_")];
  //app.filters[id] = [];
  //connect all posts that fit under this filter here! TODO: Parse integration here!`
});

//Cancel logic for new filter creation
$("#newFilterModal button.cancel").click(function (e) {
  $("#newFilterModal").hide(200);
  $("#newFilterModal input").val("");
  hideVeil();
});

//logic to delete a filter. TODO: Parse integration here!
$(".filter-class div span").click(function (e) {
  var filter = $(e.target).parent().parent().parent();
 
  var filterId = filter.attr("id");
   console.log(filterId);
  filter.hide(200, function (){$(this).remove();});

  app.filters[filterId] = undefined;

  Parse.Cloud.run("removeFilter", {name: filterId.replace("_", " ")}, {
    success: function (r) {
      console.log(r);
    }, error: function (r) {console.log(r);}
  })
  //filter.remove();
  //also remove from active filter list in parse!
});
