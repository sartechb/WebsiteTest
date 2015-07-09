//sets event handlers on filters
$(".filter-class div.filter-button").on("click", function (e) {runFilter(e);});

//executes a filterCommand
function runFilter(e) {
  var filter;
  //make sure we have the element with the ID tag
  if($(e.target).prop("tagName") == "H6")
    filter = $(e.target).parent().parent();
  else if ($(e.target).hasClass("filter-button"))
    filter = $(e.target).parent();
  else 
    filter = $(e.target);
  //visual effect
  filter.toggleClass("off");
  //find filter by type -> string
  var f = filter.attr("id").split("|");
  var ty = f[1];
  var st = f[0];
  console.log(filter.attr("id"), ty, st);
  console.log(app.filters[ty].length);
  //set flag variable to true
  for(var i = 0; i < app.filters[ty].length; ++i)
    if(app.filters[ty][i].filter.replace(" ", "_") == st)
      app.filters[ty][i].on = !app.filters[ty][i].on

  var classFilters = [];
  var locFilters = [];
  var timeFilters = [];
  //build arrays of "on" strings
  for(var x = 0; x < app.filters.c.length; ++x) 
    if(app.filters.c[x].on)
      classFilters.push(app.filters.c[x].filter.replace(" ","_"));
  for(var y = 0; y < app.filters.l.length; ++y) 
    if(app.filters.l[y].on)
      locFilters.push(app.filters.l[y].filter.replace(" ","_"));
  for(var z = 0; z < app.filters.t.length; ++z) 
    if(app.filters.t[z].on)
      timeFilters.push(app.filters.t[z].filter.replace(" ","_"));
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
  $(selectors.join()).not(".template-post").show(200);
  $(".post").not(selectors.join()).hide(200);
}

function createFilter (filter, type) {
  var to_insert = $("div.filter-class div.template-filter").clone(true);
  //console.log(to_insert, "this is the created filter");
  to_insert.removeClass("template-filter");
  to_insert.attr("id", filter.replace(" ","_")+type);
  to_insert.find("h6").append(filter);
  $("div.filter-class").append(to_insert);
}


