"use strict";

var reviewer = {};

(function() {
  function init() {
    $("#project_id").change(reviewer.refresh_submissions)
  }

  reviewer.refresh_submissions = function() {
    console.log("refresh")
    $("#submissions").empty()

    if ($("#project_id").val() == "") {
      return
    }

    var data = {
      "fn": "project_list_submissions",
      "project_id": $("#project_id").val()
    }
    common.callLambda(data, function(data) {
      var submissions = data.body.submissions

      // break submissions into categories
      var categories = {}
      for (var i=0; i<submissions.length; i++) {
        var submission = submissions[i]
        var display = submission.submitter_id
        var category = 'Misc'
        if (submission.info.net_id != null) {
          display = submission.info.net_id
          category = 'Students'
        }
        if (submission.info.ta != null) {
          category = submission.info.ta
        }

        if (!(category in categories)) {
          categories[category] = []
        }

        submissions[i].display = display
        if (submissions[i].has_review) {
          submissions[i].display += ' [REVIEWED]'
        }
        categories[category].push(submission)
      }

      // display links
      var body = $("#submissions")

      $('<h1>',{
          text: 'Sumbissions: ' + submissions.length
      }).appendTo(body)

      for (var category in categories) {
        var student_count = categories[category].length
        $('<h3>',{
          text: category + '(' + student_count + ')'
        }).appendTo(body)

        for (var i=0; i<student_count; i++) {
          var submission = categories[category][i]
          var url = ('code_review.html?project_id=' + submission.project_id +
                     '&submitter_id=' + submission.submitter_id)
          $('<a>',{
            text:submission.display,
            href:url,
            target:'_blank'
          }).appendTo(body)

          $('<br>').appendTo(body)
        }
      }
    })
  }

  init()
})()
