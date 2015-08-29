$(".post .report-me").click(function (e) {
  var post = $(e.target).closest(".post");
  app.toReport = {}
  app.toReport.flaggedPost = post.attr("id");
}); 


$("#reportMenu ul li.bucket").click(function (e) {
  var offense = $(e.target);
  $("#reportMenu ul li").removeClass("selected", 200);
  offense.addClass("selected", 200);
  $("#reportMenu .notice").fadeIn(300);
  if(offense.hasClass("offensive"))
    app.toReport.description = "offensive post";
  else if (offense.hasClass("badPost"))
    app.toReport.description = "should not be on StudyBuddy";
  else if (offense.hasClass("user"))
    app.toReport.description = "bad user";
});

$("#reportMenu ul li.other").click(function (e) {
  var offense = $(e.target);
  $("#reportMenu .notice").fadeOut(300);
  $("#reportMenu ul li").removeClass("selected", 200);
  offense.closest("li").addClass("selected", 200);
});

$("#reportMenu ul form#reportMenu-form").submit(function (e) {
  e.preventDefault();
  var input = $("#reportMenu form #reportMenu-input").val();
  if(input.length == 0) return;
  app.toReport.description = input;
  $("#reportMenu .notice").fadeIn(300);
});

$("#reportMenu .report-confirm").click(function (e){
  console.log(app.toReport);
  console.log($("#"+app.toReport.flaggedPost));
  Parse.Cloud.run("reportPost", app.toReport, {
    success: function (response) {
      $("#reportMenu .notice").fadeOut(200);
      $("#reportMenu .success").fadeIn(200);
      $("#postfeed #"+app.toReport.flaggedPost).remove();
      setTimeout(function() {
        $("#reportMenu .cancel").trigger("click");
        window.location.href = "home.html";
      }, 1000);
     // var reports = app.user.get("reportedPosts") || [];
     // reports.push(app.toReport.flaggedPost);
     // app.user.set("reportedPosts", reports);
      //app.user.save();

    }, error: function (error) {console.log(error);}
  });
});

$("#reportMenu .cancel").click(function (e) {
  $("#reportMenu p").hide();
  $("#reportMenu ul li").removeClass("selected");
});
