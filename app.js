//app.js
App({
  onLaunch: function () {
  
  },
  globalData: {
    photos: [],
    speed: 8,
  },

  setGlobalData:function(attr,value){
    // this.setData({
    //   attr:value
    // })
    console.log(this.globalData);
  }
  
})