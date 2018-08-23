//index.js
//获取应用实例

var util = require('../../utils/util.js');

const app = getApp();
var global_var = app.globalData;
var total=0;
var arr = new Array();
var arrayVoices = [];
var voiceNum=0;
var imgNum=0;
var seconds = 0;
Page({
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('voice')
  },
  data: {
    cameraDirection: "back",
    button: ['拍摄','播放'],
    buttonRight:['帧数','延时'],
    button2: ['切换', '删除', '复制'],
    
    hiddenSetFrame: true,

    hiddenSetRelay:true,
    ralayIntervalValue:10.0,
    ralayTotalValue:0.5,

    startRelayCamera: true,
    ralayCameraLock:true,
    speedFrame:8,

    preview: '',
    currId:'',
    cameraIsShow:true,
    pages:0,
    array:'',
    currentId:0,

    buttonsRecord: ['录音'],
    recordLock:false,
    voiceSrc: 'http://fjdx.sc.chinaz.com/Files/DownLoad/sound1/201708/9132.wav',
    lock: false,

    countLock: false,

    arrayV:arrayVoices,
    currVId:'',

    hiddenMergePanel:true,
    VolframeId:1,
  },

  onLoad: function () {
    
    // wx.authorize({
    //   scope: 'scope.camera',
    //   success(res) {
    //     console.log('相机授权成功')
        
    //   },
    //   fail() {
    //     console.log('相机授权失败')
    //   }
    // })
    var that = this;
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onError(function () {
      console.log("录音失败！")
    });
    this.recorderManager.onStop(function (res) {
      var idValue = Math.random();
      voiceNum++;
      var voiceObj = { name: 'play', src: res.tempFilePath, id: idValue, num: voiceNum};
      arrayVoices.push(voiceObj);
      that.setData({
        src: res.tempFilePath,
        countLock: false,
        arrayV: arrayVoices,
      })
      console.log((seconds / 1000).toFixed(2));
      seconds = 0;
      that.tip("录音完成！")
    });

    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      that.tip("播放录音失败！")
    })
  },
  onShow:function(){
    this.onLoad()
  },
  clickTakePhoto: function () {
    total++;
    if (this.data.cameraIsShow!=true){
      this.setData({
        cameraIsShow: true,
        button: ['拍摄', '播放'],
      })
    }else{
      this.setData({
        pages: total,
      })
      this.audioPlay();
        const ctx = wx.createCameraContext();
        ctx.takePhoto({
          quality: 'high',
          success: (res) => {


            var src = res.tempImagePath;
            var idValue = Math.random();
            imgNum++;
            var location1 = { id: idValue, path: src ,num:imgNum};
            ;
            arr.push(location1);

            this.setData({
              array: arr,
            })
            
            app.globalData.photos = arr;

          },
        });
    }


  },
  frameEvent: function (e) {
    var id = e.target.id;
    var src=e.target.dataset.path;

    
    
    this.setData({
      preview:src,
      cameraIsShow: false,
      button: ['继续', '播放'],
      currId:id,
    })

  },
  switchCamera:function(){
    if (this.data.cameraDirection=="back"){
      this.setData({
        cameraDirection:"front"
      })
    }else{
      this.setData({
        cameraDirection: "back"
      })
    }
  },
  delFrame:function(){
    if(total==0){
      return;
    }
    total--;
    var id = this.data.currId;
    util.del(arr, id);

    var tem = arr;
    imgNum = 0;
    var sum = arr.length;
    for (var i = 0; i < sum; i++) {
      imgNum++;
      tem[i].num = imgNum;
    }
    arr = [];
    arr = tem;
    // this.setData({
    //   arrayV: arrayVoices,
    // })
    this.setData({
      array: arr,
      pages:total,
    })
  },
  play:function(speed){

    this.setData({
      cameraIsShow:false,
      button: ['继续','播放'],
    })
      var i=0;
      var speed=100;
      var len=app.globalData.photos.length;
      util.cicleShowImage(i, len,this);

  },

  //  帧数设置面板
  setFrame: function () {
    this.setData({
      hiddenSetFrame: false
    })
  },
  SetFrameCancel: function () {
    this.setData({
      hiddenSetFrame: true
    });
  },
  SetFrameConfirm: function () {
    this.setData({
      hiddenSetFrame: true
    })
    global_var.speed = this.data.speedFrame;

  },
  frameValue:function(e){
    this.setData({
      speedFrame: e.detail.value
    })
  },

  //延迟摄影面板
  setRelay: function () {
    this.setData({
      hiddenSetRelay: false
    })
  },
  SetRelayCancel: function () {
    this.setData({
      hiddenSetRelay: true
    });
  },
  SetRelayConfirm: function () {


    this.setData({
      hiddenSetRelay: true,
      startRelayCamera:false,
    })
    var interval = this.data.ralayIntervalValue * 1000;
    var total = this.data.ralayTotalValue * 1000;
    this.relayCatch(total,interval);
  },
  ralayInterval: function (e) {
    this.setData({
      ralayIntervalValue: e.detail.value
    })
  },
  ralayTotal: function (e) {
    this.setData({
      ralayTotalValue: e.detail.value
    })
  },
  relayCatch(interval,total){
    if (this.data.ralayCameraLock!=true){
      return;
    }
    if (total<=0){
      return;
    }
    
    var sum=total;
    var i=interval;
    var that = this;
    console.log(sum + ',' + i);
    that.clickTakePhoto();
    sum-=i;
    setTimeout(function () {
      that.relayCatch(i, sum)
    }, interval);

  },

  CancelRelaying(){
    
    this.setData({
      startRelayCamera: true,
      ralayCameraLock:false,
    })
  },

  //音频方法
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  audio14: function () {
    this.audioCtx.seek(14)
  },
  audioStart: function () {
    this.audioCtx.seek(0)
  },
  recordVoice: function () {
    console.log('录音');
  },
 tip: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },

 startRecordMp3: function () {

    this.setData({
      countLock: true,
      recordLock: true,
      buttonsRecord: ['停止']
    })
    this.countSeconds();
    this.recorderManager.start({
      format: 'mp3'
    });

  },
 stopRecord: function () {
    this.recorderManager.stop()
   
   this.setData({
     recordLock: false,
     buttonsRecord: ['录音']
   })

  }, 
  playRecord: function (src) {
    console.log(src);

    this.innerAudioContext.src =  src;
    this.innerAudioContext.play()
  },
  voiceEvent:function(e){
    var voice = e.target.dataset.src;
    var id=e.target.id;
    this.setData({
      currVId: id
    })
    this.playRecord(voice);
  },

  delVoice: function () {
    var id = this.data.currVId;
    util.del(arrayVoices, id);
    var tem = arrayVoices;
    voiceNum=0;
    var sum = arrayVoices.length;
    for(var i=0; i<sum; i++){
      voiceNum++;
      tem[i].num=voiceNum;
    }
    arrayVoices = [];
    arrayVoices=tem;
    this.setData({
      arrayV: arrayVoices,
    })
  },

  merge:function(){
    this.setData({
      hiddenMergePanel: false
    })
  },
  MergeCancel:function(){
    this.setData({
      hiddenMergePanel: true
    })
  },
  MergeConfirm:function(){
    var id = this.data.currId;
    for(var i=0, len=arr.length; i<len; i++){
      if (arr[i].id==id){
        arr[i].voiceId = this.data.VolframeId;
      }
    }
    this.setData({
      hiddenMergePanel: true,
      array: arr,
    })
    app.globalData.photos = arr;
  },
  VolframeVal:function(e){
    this.setData({
      VolframeId: e.detail.value
    })
  },
  MergeImgVoice: function (i) {
    console.log(i);
  },
  countSeconds() {
    if (this.data.countLock == false) {
      return;
    }
    seconds += 10;
    setTimeout(this.countSeconds, 10);
  },

  error(e) {
    console.log(e.detail)
  },

})
