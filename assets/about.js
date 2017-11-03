var common = require("./common");

common.then(function(){

  // Load timeline plugin
  require('./vendor/vertical-timeline/dist/vertical-timeline.css');

  require(['./vendor/vertical-timeline/dist/vertical-timeline.js'], function(timeline){
  
    console.log("Loaded timeline plugin");
    $('#myTimeline').verticalTimeline({
      startLeft: false,
      alternate: true,
      animate: "fade",
      arrows: false 
    });
  });

  $('.medaille').on('mouseover', function(){
    $(this).transition('pulse');
  });

});

