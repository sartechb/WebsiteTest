//sets event handlers on filters
$(".modal-dialog .container .row").click(function (e) {runFilter(e)});

//executes a filterCommand
function runFilter(e) {
  var filter = $(e.target);
  if(filter.prop("tagName") == "I") {
    filter = filter.parent().parent();
    removeFilter(filter);
  } else if(filter.prop("tagName") == "H4") 
    filter = filter.parent().parent();
  else if(filter.hasClass("title"))
    filter = filter.parent();

  filter.toggleClass("active");
  //find filter by type -> string
  var f = filter.attr("id").split("|");
  var ty = f[1];
  var st = f[0];
  console.log(filter.attr("id"), ty, st);
  console.log(app.filters[ty].length);
  //set flag variable to not of variable
  for(var i = 0; i < app.filters[ty].length; ++i)
    if(app.filters[ty][i].filter.replace(/\s+/g, "_") == st)
      app.filters[ty][i].on = !app.filters[ty][i].on;

  var classFilters = [];
  var locFilters = [];
  var timeFilters = [];
  //build arrays of "on" strings
  for(var x = 0; x < app.filters.c.length; ++x) 
    if(app.filters.c[x].on)
      classFilters.push(app.filters.c[x].filter.replace(/\s+/g,"_"));
  for(var y = 0; y < app.filters.l.length; ++y) 
    if(app.filters.l[y].on)
      locFilters.push(app.filters.l[y].filter.replace(/\s+/g,"_"));
  for(var z = 0; z < app.filters.t.length; ++z) 
    if(app.filters.t[z].on)
      timeFilters.push(app.filters.t[z].filter.replace(/\s+/g,"_"));
  //check for edge cases
  if(classFilters.length == 0) classFilters.push("");
  if(locFilters.length == 0) locFilters.push("");
  if(timeFilters.length == 0) timeFilters.push("");  
  var selectors = [];
  //Create the combinations of valid strings
  for(var a = 0; a < classFilters.length; ++a) {
    for(var b = 0; b < locFilters.length; ++ b) {
      for(var c = 0; c < timeFilters.length; ++c) {
        var classSel = ((classFilters[a].length==0)?(""):("."+classFilters[a]));
        var locSel = ((locFilters[b].length==0)?(""):("."+locFilters[b]));
        var timeSel = ((timeFilters[c].length==0)?(""):("."+timeFilters[c]));
        //if(sel.length!=0)
        selectors.push(".post"+classSel+locSel+timeSel);
      }
    }
  }
  //do the visual stuff
  console.log(selectors);
  $(selectors.join()).not(".template-post").fadeIn(200);
  $(".post").not(selectors.join()).fadeOut(200);
}

function createFilter (filter, type) {
  var to_insert = $("div.row.template-filter").clone(true);
  //console.log(to_insert, "this is the created filter");
  to_insert.removeClass("template-filter");
  to_insert.attr("id", filter.replace(/\s+/g,"_")+type);
  to_insert.find("h4").append(filter);
  if(type == "|c")
    $("#classFilterMenu .modal-dialog .container").append(to_insert);
  else if(type == "|l")
    $("#locFilterMenu .modal-dialog .container").append(to_insert);
  else if(type == "|t")
    $("#timeFilterMenu .modal-dialog .container").append(to_insert);
}

$("form#classFilterAdd").submit(function(e) {
  e.preventDefault();
  //check if exists
  var input = $("#classFilterAddInput");
  var inputVal = input.val().trim().toUpperCase();
  if(app.classes.indexOf(inputVal) == -1) {
    $("#classFilterMenu .notice").fadeIn(200);
    setTimeout(function(){$("#classFilterMenu .notice").fadeOut(200);}, 6000);
    input.val("");
    return;
  }
  //check if part of user filters
  var i = 0;
  if(app.filters.c != undefined) {
    for(i = 0; i < app.filters.c.length; ++i) 
      if(app.filters.c[i].filter == inputVal)
        break;
  } else {
    app.filters.c = [];
  }
  if(i < app.filters.c.length) {
    //filter exists, and posts are present
    createFilter(inputVal, "|c");
  } else {
    //filter DNE, must load from parse
    app.filters.c.push({filter:inputVal, on:false});
    getFilterPosts(false, inputVal, "c");
    createFilter(inputVal, "|c");
    var userFilters = app.user.get("filters");
    userFilters.push(inputVal+"|c");
    app.user.set("filters", userFilters);
    app.user.save();
  }
  console.log(input.val());
  input.val("");
});

$("form#locFilterAdd").submit(function(e) {
  e.preventDefault();
  //check if exists
  var input = $("#locFilterAddInput");
  var inputVal = input.val().trim();
  if(app.locations.indexOf(inputVal) == -1) {
    $("#locFilterMenu .notice").fadeIn(200);
    setTimeout(function(){$("#locFilterMenu .notice").fadeOut(200);}, 6000);
    input.val("");
    return;
  }
  //check if part of user filters
  var i = 0;
  if(app.filters.l != undefined) {
    for(i = 0; i < app.filters.l.length; ++i) 
      if(app.filters.l[i].filter == inputVal)
        break;
  } else {
    app.filters.l = [];
  }
  if(i < app.filters.l.length) {
    //filter exists, and posts are present
    createFilter(inputVal, "|l");
  } else {
    //filter DNE, must load from parse
    app.filters.l.push({filter:inputVal, on:false});
    getFilterPosts(false, inputVal, "l");
    createFilter(inputVal, "|l");
    var userFilters = app.user.get("filters");
    userFilters.push(inputVal+"|l");
    app.user.set("filters", userFilters);
    app.user.save();
    console.log("had to pull from parse");
  }
  console.log(input.val());
  input.val("");
});

function removeFilter(filter) {
   filter.hide(200);
    var f1 = filter.attr("id").split("|");
    var ty1 = f1[1];
    var st1 = f1[0];
    for(var ex = 0; ex < app.filters[ty1].length; ++ex)
      if(app.filters[ty1][ex].filter.replace(/\s+/g, "_") == st1)
        app.filters[ty1][ex].on = true;
    var userFilters = app.user.get("filters");
    var toRemove = userFilters.indexOf(st1.replace(/_+/g," ")+"|"+ty1);
    console.log(userFilters, toRemove);
    userFilters.splice(toRemove,1);
    app.user.set("filters", userFilters);
    app.user.save();
    filter.remove();
}

// $(".modal-dialog .container .row i.fa-times").click(function (e) {
//   console.log(e.target);
//   var filter = $(e.target).parent().parent();
//   console.log(filter);
// })