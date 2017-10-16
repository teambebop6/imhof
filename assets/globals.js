module.exports.getIncrement = function(val, step = 1){
  return parseInt(val) + parseInt(step);
}

module.exports.getDecrement = function(val, step = 1){
  val = parseInt(val);
  step = parseInt(step);
  if(val - step > 1) {
    return val - step;
  }else{
    return 1;  
  }
}
