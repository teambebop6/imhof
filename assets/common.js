require('./vendor/Semantic-UI/dist/components/reset.css'); // html boilerplate

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

require('./vendor/Semantic-UI/dist/components/icon.css');

// Less
//
require('./less/main.less');

var common = new Promise(function(resolve, reject){

  console.log("Before loading jquery...");
  require(['jquery'], function($){
    console.log("after loading jquery...");
    
    jQuery = $;
    window.jQuery = jQuery;
    window.$ = $;

    require(['./vendor/jquery.validate.min.js'], function(){
      require('./js/jquery.validate.custom.js');
    });

    console.log("Before loading main...");
    require('./js/main.js'); // Include main.js
    console.log("Before loading semantic components...");
    
    require('./vendor/Semantic-UI/dist/components/site.js');
    require('./vendor/Semantic-UI/dist/components/modal.js');
    require('./vendor/Semantic-UI/dist/components/dimmer.js');
    require('./vendor/Semantic-UI/dist/components/transition.js');
    require('./vendor/Semantic-UI/dist/components/form.js');
    require('./vendor/Semantic-UI/dist/components/checkbox.js');
    require('./vendor/Semantic-UI/dist/components/dropdown.js');

    console.log("After.");

    $('.ui.message').hide();

    $('.ui.checkbox').checkbox();

    resolve();
  });
});


module.exports = common;