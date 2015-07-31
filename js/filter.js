//sets event handlers on filters
$(".modal-dialog .filterMenu .container .row").click(function (e) {runFilter(e);});

//executes a filterCommand
function runFilter(e) {
  //determine the correct target
  var filter = $(e.target);
  if(filter.prop("tagName") == "I") {
    filter = filter.parent().parent();
    removeFilter(filter);
  } else if(filter.prop("tagName") == "H4") 
    filter = filter.parent().parent();
  else if(filter.hasClass("title"))
    filter = filter.parent();

  //visually changes how filter looks
  filter.toggleClass("active");
  //find filter by type -> string
  var f = filter.attr("id").split("|");
  var ty = f[1];
  var st = f[0];//ID String
  //console.log(filter.attr("id"), ty, st);
  //console.log(app.filters[ty].length);
  //set flag variable to not of flag variable
  for(var i = 0; i < app.filters[ty].length; ++i)
    if(app.filters[ty][i].id == st)
      app.filters[ty][i].on = !app.filters[ty][i].on;

  applyFilterChanges();
}

function applyFilterChanges() {

  for(var i = 0; i < app.filters.t.length; ++i) 
    saveFilterPhrase(app.filters.t[i].filter);

  var classFilters = [];
  var locFilters = [];
  var textFilters = [];
  //build arrays of "on" strings
  for(var x = 0; x < app.filters.c.length; ++x) 
    if(app.filters.c[x].on)
      classFilters.push(app.filters.c[x].id);
  for(var y = 0; y < app.filters.l.length; ++y) 
    if(app.filters.l[y].on)
      locFilters.push(app.filters.l[y].id);
  for(var z = 0; z < app.filters.t.length; ++z) 
    if(app.filters.t[z].on)
      textFilters.push(app.filters.t[z].id);
  //check for edge cases
  if(classFilters.length == 0) classFilters.push("");
  if(locFilters.length == 0) locFilters.push("");
  if(textFilters.length == 0) textFilters.push("");  
  var selectors = [];
  //Create the combinations of valid strings
  for(var a = 0; a < classFilters.length; ++a) {
    for(var b = 0; b < locFilters.length; ++ b) {
      for(var c = 0; c < textFilters.length; ++c) {
        var classSel = ((classFilters[a].length==0)?(""):("."+classFilters[a]));
        var locSel = ((locFilters[b].length==0)?(""):("."+locFilters[b]));
        var textSel = ((textFilters[c].length==0)?(""):("."+textFilters[c]));
        //if(sel.length!=0)
        selectors.push(".post"+classSel+locSel+textSel);
      }
    }
  }
  //do the visual stuff
  //console.log(selectors);
  $(selectors.join()).not(".template-post").fadeIn(200);
  if($(selectors.join()).not(".template-post").length)
    $("#empty-feed").fadeOut(200);
  else
    $("#empty-feed").fadeIn(200);
  $(".post").not(selectors.join()).fadeOut(200);

  updateFilterNotify(classFilters, locFilters, textFilters);
}

function updateFilterNotify(c, l, t) {
 // //console.log("updateFilterNotify");
  if(c[0]=="") c.pop();
  if(l[0]=="") l.pop();
  if(t[0]=="") t.pop();
  //console.log(c, l, t);
  for(var n = 0; n < c.length; ++n) c[n] = c[n].replace(/_+/g, " ");
  for(var m = 0; m < l.length; ++m) l[m] = l[m].replace(/_+/g, " ");
  for(var p = 0; p < t.length; ++p) t[p] = t[p].replace(/_+/g, " ");
  //console.log(c, l, t);
//  //console.log(c.length, l.length, t.length);
  if(c.length + l.length + t.length > 0) {
    $(".filter-notify span.leader").fadeIn(200);
    
    if(c.length > 0) {
      $(".filter-notify span.class-leader").fadeIn(200);
      $(".filter-notify span.class-section").html(c.join(", ")).fadeIn(200);
    } else {
      $(".filter-notify span.class-leader").fadeOut(200);
      $(".filter-notify span.class-section").html("");
    }
    if(l.length > 0) {
      $(".filter-notify span.loc-leader").fadeIn(200);
      $(".filter-notify span.loc-section").html(l.join(", ")).fadeIn(200);
    } else {
      $(".filter-notify span.loc-leader").fadeOut(200);
      $(".filter-notify span.loc-section").html("");
    }
    if(t.length > 0) {
      $(".filter-notify span.text-leader").fadeIn(200);
      $(".filter-notify span.text-section").html(t.join(", ")).fadeIn(200);
    } else {
      $(".filter-notify span.text-leader").fadeOut(200);
      $(".filter-notify span.text-section").html("");
    }
    if(c.length > 0 && l.length > 0) 
      $(".filter-notify span.and-loc").fadeIn(200);
    else
      $(".filter-notify span.and-loc").fadeOut(200);
    if((c.length > 0 && t.length > 0)||(l.length > 0 && t.length > 0)) 
      $(".filter-notify span.and-text").fadeIn(200);
    else
      $(".filter-notify span.and-text").fadeOut(200);
  } else {
    $(".filter-notify span").fadeOut(200);
  }
}

function createFilter (filter, type, on) {
  var to_insert = $("div.row.template-filter").clone(true);
  ////console.log(to_insert, "this is the created filter");
  to_insert.removeClass("template-filter");
  to_insert.attr("id", filter.replace(/\s+/g,"_")+type);
  to_insert.find("h4").append(filter);
  if(on) to_insert.addClass("active");
  if(type == "|c")
    $("#classFilterMenu .modal-dialog .container").append(to_insert);
  else if(type == "|l")
    $("#locFilterMenu .modal-dialog .container").append(to_insert);
  else if(type == "|t")
    $("#textFilterMenu .modal-dialog .container").append(to_insert);
  //return to_insert;
}

$("form#classFilterAdd").submit(function(e) {
  e.preventDefault();
  //check if exists
  var input = $("#classFilterAddInput");
  var inputVal = input.val().trim();
  if(app.classes.indexOf(inputVal) == -1) {
    $("#classFilterMenu .notice.dne").fadeIn(200);
    setTimeout(function(){$("#classFilterMenu .notice.dne").fadeOut(200);}, 6000);
    input.val("");
    return;
  }
  //check if part of user filters
  var i = -1;
  if(app.filters.c != undefined) {
    for(var j = 0; j < app.filters.c.length; ++j)
      if(app.filters.c[j].filter == inputVal)
        i = j;
    //console.log(i);
  } else {
    app.filters.c = [];
  }
  if(i != -1) {
    //if filter exists, then posts are present
    //check is duplicate
    if($("#classFilterMenu #"+inputVal.replace(/\s+/g,"_")+"\\|c").length > 0) {
      $("#classFilterMenu .notice.dup").fadeIn(200);
      setTimeout(function(){$("#classFilterMenu .notice.dup").fadeOut(200);}, 6000);
      input.val("");
      return;
    }
    createFilter(inputVal, "|c", true);
    app.filters.c[i].on = true;
    applyFilterChanges();
  } else {
    //filter DNE, must load from parse
    Parse.Cloud.run("createFilter", {
      filter:inputVal,
      on:false,
      type:"c"
    }, {
      success: function(response) {
        app.filters.c.push(new filterObject(inputVal, true));
        getFilterPosts("c", true);
        createFilter(inputVal, "|c", true);
        //filt.trigger("click");
      }, error: function(error) {console.log(error);}
    });
  }
  //console.log(input.val());
  input.val("");

});

$("form#locFilterAdd").submit(function(e) {
  e.preventDefault();
  //check if exists
  var input = $("#locFilterAddInput");
  var inputVal = input.val().trim();
  if(app.locations.indexOf(inputVal) == -1) {
    $("#locFilterMenu .notice.dne").fadeIn(200);
    setTimeout(function(){$("#locFilterMenu .notice.dne").fadeOut(200);}, 6000);
    input.val("");
    return;
  }
  //check if part of user filters
  var i = -1;
  if(app.filters.l != undefined) {
    for(var j = 0; j < app.filters.l.length; ++j)
      if(app.filters.l[j].filter == inputVal)
        i = j;
  } else {
    app.filters.l = [];
  }
  if(i != -1) {
    //filter exists, and posts are present: duplicate case
    if($("#locFilterMenu #"+inputVal.replace(/\s+/g,"_")+"\\|l").length > 0) {
      $("#locFilterMenu .notice.dup").fadeIn(200);
      setTimeout(function(){$("#locFilterMenu .notice.dup").fadeOut(200);}, 6000);
      input.val("");
      return;
    }
    createFilter(inputVal, "|l", true);
    app.filters.l[i].on = true;
    applyFilterChanges();
  } else {
    //filter DNE, must load from parse
    Parse.Cloud.run("createFilter", {
      filter:inputVal,
      on:false,
      type:"l"
    }, {
      success: function(response) {
        app.filters.l.push(new filterObject(inputVal, true));
        getFilterPosts("l", true);
        createFilter(inputVal, "|l", true);
        //filt.trigger("click");
      }, error: function(error) {console.log(error);}
    });
    //console.log("had to pull from parse");
  }
  //console.log(input.val());
  input.val("");
});

$("form#textFilterAdd").submit(function(e) {
  e.preventDefault();
  var input = $("#textFilterAddInput");
  var inputVal = input.val().trim();
  
  //check if duplicate
  var i = -1;
  if(app.filters.t != undefined) {
    for(var j = 0; j < app.filters.t.length; ++j)
      if(app.filters.t[j].filter == inputVal)
        i = j;
  } else {
    app.filters.t = [];
  }

  if(i != -1) {
    if($("#locFilterMenu #"+inputVal.replace(/\s+/g,"_")+"\\|l").length > 0) {
      input.val("");
      return;
    }
    createFilter(inputVal, "|t", true);
    app.filters.t[i].on = true;
    applyFilterChanges();
  } else {
    //filter dne, must pull posts
    Parse.Cloud.run("createFilter", {
      filter:inputVal,
      on:false,
      type:"t"
    }, {
      success: function(response) {
        app.filters.t.push(new filterObject(inputVal, true));
        getFilterPosts("t", true);
        createFilter(inputVal, "|t", true);
        //filt.trigger("click");
      }, error: function(error) {console.log(error);}
    });
  }
  //Add class for selection to all known posts.
  saveFilterPhrase(inputVal);
  input.val("");
});

//STILL NEED TO INCLUDE IN POST CREATION SOMEWHERE
function saveFilterPhrase(val) {
  var s = val.replace(/\s+/g, "_").replace("\/", "\\/").replace("\?", "\\?");
  console.log(s);
  for(var p in app.posts) {
    //console.log(app.posts[p].title, ", "+val, app.posts[p].title.search(val));
    if(app.posts[p].title.search(s) != -1 && !$("#postholder #"+app.posts[p].postId).hasClass(s)) 
      $("#postholder #"+app.posts[p].postId).addClass(s);
  }
}

function removeFilter(filter) {
   filter.hide(200);
    var f1 = filter.attr("id").split("|");
    var ty1 = f1[1];
    var st1 = f1[0];
    for(var ex = 0; ex < app.filters[ty1].length; ++ex)
      if(app.filters[ty1][ex].filter.replace(/\s+/g, "_") == st1)
        app.filters[ty1][ex].on = true;
    Parse.Cloud.run("removeFilter", {
      filter: st1.replace(/_/g, " "),
      type: ty1
    },{
      success: function () {},error:function(e){console.log(e);}
    })
    filter.remove();
}

$("#classFilterMenu span.link").click(function () {
  $("#classFilterMenu button").trigger("click");
  $('#new-post-bar h2.untoggle').trigger("click");
});

// $("#classFilterMenu").on("hide.bs.modal", function (e){
//   console.log(app.filters.c);
//    Parse.Cloud.run("updateFilterState", {
//       filters: app.filters.c,
//       type: "c"
//    }, {
//     success: function(response) {}, 
//     error: function(error) {console.log(error);}
//    });
// });

// $("#locFilterMenu").on("hide.bs.modal", function (e){
//    Parse.Cloud.run("updateFilterState", {
//       filters: app.filters.l,
//       type: "l"
//    }, {
//     success: function(response) {}, 
//     error: function(error) {console.log(error);}
//    });
// });

// $("#textFilterMenu").on("hide.bs.modal", function (e){
//    Parse.Cloud.run("updateFilterState", {
//       filters: app.filters.t,
//       type: "t"
//    }, {
//     success: function(response) {}, 
//     error: function(error) {console.log(error);}
//    });
// });

// $(".modal-dialog .container .row i.fa-times").click(function (e) {
//   //console.log(e.target);
//   var filter = $(e.target).parent().parent();
//   //console.log(filter);
// })