// pages/demo1/demo1.js
const bgMusic = wx.createInnerAudioContext()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPayed: false,
    isOpen: false,//播放开关
    starttime: '00:00', //正在播放时长
    duration: '01:00',   //总时长
    src: "http://118.31.17.153/medias/demo.mp3",
    pay_status: 0,
    area_code: 0,
    narrator_code: 0,
    narrator:{
      name: 0,
      title: 0,
      img_url: 0,
      price: 0,
      score: 0,
      explain_overview: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      pay_status: options.pay_status,
      area_code: options.area_code,
      narrator_code: options.narrator_code
    })
    var app = getApp();
    wx.request({
      url: app.globalData.server_address + '/narrator',
      data: {
        area_code: that.data.area_code,
        narrator_code: that.data.narrator_code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('ready')
    console.log(this.data.pay_status)
    if(this.data.pay_status == "1"){
      wx.showToast({  
        title: '取消支付',  
        icon: 'none',  
        duration: 1500  
      })
    } else if(this.data.pay_status == "2") {
      wx.showToast({  
        title: '已支付',  
        icon: 'success',  
        duration: 1500  
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show')
    console.log(this.data.pay_status)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this
    that.listenerButtonStop()//停止播放
    console.log("离开")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 播放
  listenerButtonPlay: function (e) {
    var that = this;
    //bug ios 播放时必须加title 不然会报错导致音乐不播放
    bgMusic.title = '此时此刻'  
    bgMusic.epname = '此时此刻'
    bgMusic.src = that.data.src;
    console.log(1111)
    bgMusic.onTimeUpdate(() => { 
      //bgMusic.duration总时长  bgMusic.currentTime当前进度
      console.log(2222)
      console.log(bgMusic.currentTime)
      var duration = bgMusic.duration; 
      var offset = bgMusic.currentTime;  
      var currentTime = parseInt(bgMusic.currentTime);
      var min = "0" + parseInt(currentTime / 60);
      var max = parseInt(bgMusic.duration);
      var sec = currentTime % 60;
      if (sec < 10) {
        sec = "0" + sec;
      };
      var starttime = min + ':' + sec;   /*  00:00  */
      that.setData({
        offset: currentTime,
        starttime: starttime,
        max: max,
        changePlay: true
      })
    })
    //播放结束
    bgMusic.onEnded(() => {
      that.setData({
        starttime: '00:00',
        isOpen: false,
        offset: 0
      })
      console.log("音乐播放结束");
    })
    console.log(222);
    bgMusic.play();
    console.log(bgMusic.duration);
    that.setData({
      isOpen: true,
    })
  },
  //暂停播放
  listenerButtonPause(){
     var that = this
    bgMusic.pause()
    that.setData({
      isOpen: false,
    })
  },
  listenerButtonStop(){
    var that = this
    bgMusic.stop()
  },
  // 进度条拖拽
  sliderChange(e) {
    var that = this
    var offset = parseInt(e.detail.value);
    bgMusic.play();
    bgMusic.seek(offset);
    that.setData({
      isOpen: true,
    })
  },

  jumpToPreview: function (e) {
    wx.navigateTo({
      url: '/pages/preview/preview?price=12.00'
    })
  }
})