module.exports.jumpTo = function(offset){
  console.log(offset);

  var navHeight = $('.page-nav').height() || 0;
  var subnavHeight = $('.subnav-grid').height() || 0;

  $('html, body').animate({
    scrollTop: offset.top - navHeight - subnavHeight
  }, 900, 'swing');
}
