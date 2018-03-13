require('./vendor/Semantic-UI/dist/components/reset.css'); // html boilerplate

// Semantic css
require('./vendor/Semantic-UI/dist/components/site.css');
require('./vendor/Semantic-UI/dist/components/grid.css');
require('./vendor/Semantic-UI/dist/components/menu.css');
require('./vendor/Semantic-UI/dist/components/item.css');
require('./vendor/Semantic-UI/dist/components/sidebar.css');
require('./vendor/Semantic-UI/dist/components/button.css');
require('./vendor/Semantic-UI/dist/components/modal.css');
require('./vendor/Semantic-UI/dist/components/dimmer.css');
require('./vendor/Semantic-UI/dist/components/transition.css');
require('./vendor/Semantic-UI/dist/components/form.css');
require('./vendor/Semantic-UI/dist/components/input.css');
require('./vendor/Semantic-UI/dist/components/label.css');
require('./vendor/Semantic-UI/dist/components/container.css');
require('./vendor/Semantic-UI/dist/components/image.css');
require('./vendor/Semantic-UI/dist/components/header.css');
require('./vendor/Semantic-UI/dist/components/message.css');
require('./vendor/Semantic-UI/dist/components/checkbox.css');
require('./vendor/Semantic-UI/dist/components/dropdown.css');
require('./vendor/Semantic-UI/dist/components/table.css');
require('./vendor/Semantic-UI/dist/components/divider.css');
require('./vendor/Semantic-UI/dist/components/list.css');
require('./vendor/Semantic-UI/dist/components/sticky.css');
require('./vendor/Semantic-UI/dist/components/icon.css');

// Datepicker
require('./vendor/jquery.picker/picker.min.css');

// Less
//
require('./less/main.less');

var common = new Promise(function(resolve, reject){

  require(['jquery'], function($){

    jQuery = $;
    window.jQuery = jQuery;
    window.$ = $;

    require('./js/main.js'); // Include main.js

    // Semantic js
    require('./vendor/Semantic-UI/dist/components/site.js');
    require('./vendor/Semantic-UI/dist/components/modal.js');
    require('./vendor/Semantic-UI/dist/components/dimmer.js');
    require('./vendor/Semantic-UI/dist/components/transition.js');
    require('./vendor/Semantic-UI/dist/components/form.js');
    require('./vendor/Semantic-UI/dist/components/checkbox.js');
    require('./vendor/Semantic-UI/dist/components/dropdown.js');
    require('./vendor/Semantic-UI/dist/components/sticky.js');

    // Return home - logo effects
    $('.logo-container').transition('horizontal flip').transition('horizontal flip');
    setInterval(function(){
      $('.logo-container').transition('horizontal flip').transition('horizontal flip');
    }, 8000)

    $('.return-home').on('mouseover', function(){
      $(this).find('p').show();
    });
    $('.return-home').on('mouseout', function(){
      $(this).find('p').hide();
    });

    // Resolve promise
    resolve();
  });
});

module.exports = common;
