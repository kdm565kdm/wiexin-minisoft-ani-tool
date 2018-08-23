const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  cicleShowImage: cicleShowImage,
  del:del
}
const app = getApp();
var global_var = app.globalData;
var speed = 1000 / global_var.speed;
// var index = require('../pages/index/index.js');
function cicleShowImage(i, len,obj){
  var that=this;
  var i=i;
  var len=len;
  var obj=obj;
  if (i >= len) {
    //console.log(app.globalData.photos);
    return;
  }
  var img = global_var.photos[i].path;
if (global_var.photos[i].voiceId!=undefined){
  obj.playRecord(obj.data.arrayV[global_var.photos[i].voiceId]);
  //console.log(obj.data.array[i]);
 }
  obj.setData({
    preview: img 
  })


  i++;
  
  setTimeout(function(){
    that.cicleShowImage(i, len, obj)
  }, 1000 / app.globalData.speed);
  


}

function del(arr,id){
  for(var i=0, len=arr.length; i<len; i++){
    if(arr[i].id==id){
      arr.splice(i,1);
      break;
    }
  }
}