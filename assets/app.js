// Webpack entry point

//require("./vendor/font-awesome.min.css")
//require("./vendor/glyph_icons/icon.min.css")

// Stylesheets
//

require('./vendor/Semantic-UI/dist/components/reset.css'); // html boilerplate

require('../bower_components/lightbox2/dist/css/lightbox.css')

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

require('./vendor/Semantic-UI/dist/components/icon.css');

// Less
//
require('./less/main.less');

require(['jquery'], function($){
  //require('./vendor/Semantic-UI/dist/semantic.min.js');

  jQuery = $;
  window.jQuery = jQuery;
  window.$ = $;

  require(['./vendor/jquery.validate.min.js'], function(){
    require('./js/jquery.validate.custom.js');
  });

  require('./js/main.js'); // Include main.js
  //require('../bower_components/lightbox2/dist/js/lightbox.min.js')
  
  
  require('./vendor/Semantic-UI/dist/components/site.js');
  require('./vendor/Semantic-UI/dist/components/modal.js');
  require('./vendor/Semantic-UI/dist/components/dimmer.js');
  require('./vendor/Semantic-UI/dist/components/transition.js');
  require('./vendor/Semantic-UI/dist/components/form.js');



  $('.ui.message').hide();

})


