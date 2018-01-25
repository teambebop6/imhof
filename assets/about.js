var common = require("./common");

common.then(function () {

  // Load timeline plugin
  require('./vendor/vertical-timeline/dist/vertical-timeline.css');

  require([ './vendor/vertical-timeline/dist/vertical-timeline.js' ], function (timeline) {

    console.log("Loaded timeline plugin");
    $('#myTimeline').verticalTimeline({
      startLeft: false,
      alternate: true,
      animate: "fade",
      arrows: false
    });
  });

  $('.medaille').on('mouseover', function () {
    $(this).transition('pulse');
  });

  require([ './vendor/jquery.ui/jquery-ui.min.js' ], function () {
    // return;
    // Citation slider customed
    var citations = $('#citation-slider .citation');
    var citationsLength = citations.length;
    if (citationsLength > 1) {
      var idVisibleIndex = 0;
      var ids = [];
      citations.each(function (index, citation) {
        ids.push(citation.id);
      });

      function switchVisible() {
        var nextIdVisibleIndex;
        if (idVisibleIndex + 1 === citationsLength) {
          nextIdVisibleIndex = 0;
        } else {
          nextIdVisibleIndex = idVisibleIndex + 1;
        }
        $(citations[idVisibleIndex]).hide('slide', { direction: 'left' }, 500, function() {
          $(citations[nextIdVisibleIndex]).show('slide', { direction: 'right' }, 500);
          idVisibleIndex = nextIdVisibleIndex;
        });
      }

      setInterval(switchVisible, 5000);
    }
  });


});

