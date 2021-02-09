// pages/demo1/demo1.js
var bgMusic = new Array()
var wait_flag = new Array()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPayed: true,
    pay_status: null,
    area_code: 0,
    narrator_code: 0,
    narrator:{
      name: 0,
      title: 0,
      img_url: 0,
      price: 0,
      score: 0,
      explain_overview: 0
    },
    content_count: 0,
    content_list: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('222222', options)
    that.setData({
      area_code: options.area_code,
      narrator_code: options.narrator_code,
      pay_status: options.pay_status
    })
    wx.request({
      url: app.globalData.server_address + '/narrator',
      data: {
        area_code: 0,
        narrator_code: that.data.narrator_code,
        user_id: app.globalData.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        let narrator_name = 'narrator.name';
        let narrator_title = 'narrator.title';
        let narrator_img_url = 'narrator.img_url';
        let narrator_price = 'narrator.price';
        let narrator_score = 'narrator.score';
        let narrator_explain_overview = 'narrator.explain_overview';
        that.setData({
          [narrator_name]: res.data.narrator_info.name,
          [narrator_title]: res.data.narrator_info.title,
          [narrator_img_url]: res.data.narrator_info.img_url,
          [narrator_price]: res.data.narrator_info.price,
          [narrator_score]: res.data.narrator_info.score,
          [narrator_explain_overview]: res.data.narrator_info.explain_overview,
          content_count: res.data.content_count,
          content_list: res.data.content_list,
          isPayed: res.data.is_payed
        })
        for(var i = 0; i < that.data.content_count; ++i){
          bgMusic[i] = wx.createInnerAudioContext();
          wait_flag[i] = false;
        }
        console.log(that.data.content_list)
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
    }else if(this.data.pay_status == "0") {
      wx.showToast({  
        title: '支付失败',  
        icon: 'error',  
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
    console.log('bgmusic', bgMusic)
    console.log('listenerButtonPlay')
    var index = e.currentTarget.dataset.index;
    var that = this;
    var content_list_tmp = that.data.content_list
    //bug ios 播放时必须加title 不然会报错导致音乐不播放
    bgMusic[index].title = '绍兴古城' + index
    bgMusic[index].epname = '绍兴古城' + index
    bgMusic[index].src = content_list_tmp[index].audio_url;

    bgMusic[index].onTimeUpdate(() => {
      //bgMusic.duration总时长  bgMusic.currentTime当前进度
      console.log('onTimeUpdate')
      var duration = bgMusic[index].duration;
      var offset = bgMusic[index].currentTime;
      var currentTime = parseInt(bgMusic[index].currentTime);
      var min = "0" + parseInt(currentTime / 60);
      var max = parseInt(bgMusic[index].duration);
      var sec = currentTime % 60;
      if (sec < 10) {
        sec = "0" + sec;
      };
      var starttime = min + ':' + sec;   /*  00:00  */
      content_list_tmp[index].offset = currentTime;
      console.log('currentTime', currentTime)
      content_list_tmp[index].start_time = starttime;
      content_list_tmp[index].max = max;
      console.log('max', max)
      content_list_tmp[index].changePlay = true;
      that.setData({
        content_list: content_list_tmp
      })
      console.log(that.data.content_list)
    })

    //播放结束
    bgMusic[index].onEnded(() => {
      content_list_tmp[index].start_time = '0:00'
      content_list_tmp[index].is_open = false
      content_list_tmp[index].offset = 0
      that.setData({
        content_list: content_list_tmp
      })
      console.log("音乐播放结束");
    })
    
    bgMusic[index].play();
    setTimeout(() => {
      console.log(bgMusic[index].paused)
    }, 100)
    console.log(bgMusic[index].duration);
    content_list_tmp[index].is_open = true
    that.setData({
      content_list: content_list_tmp
    })
    console.log(that.data.content_list)
  },
  //暂停播放
  listenerButtonPause(e){
    console.log('listenerButtonPause')
    var index = e.currentTarget.dataset.index;
    var that = this;
    var content_list_tmp = that.data.content_list
    content_list_tmp[index].is_open = false
    bgMusic[index].pause()
    that.setData({
      content_list: content_list_tmp
    })
  },
  // 停止所有音乐播放
  listenerButtonStop(){
    var that = this
    for(var i = 0; i < that.data.content_count; ++i){
      bgMusic[i].stop();
    }
  },
  // 进度条拖拽
  sliderChange(e) {
    console.log('sliderChange')
    var that = this
    var index = e.currentTarget.dataset.index;
    var content_list_tmp = that.data.content_list
    var offset = parseInt(e.detail.value);
    content_list_tmp[index].is_open = true;
    content_list_tmp[index].offset = offset;
    bgMusic[index].play();
    setTimeout(() => {
      console.log(bgMusic[index].paused)
    }, 100)
    bgMusic[index].seek(offset);
    that.setData({
      content_list: content_list_tmp
    })
  },

  jumpToPreview: function (e) {
    wx.redirectTo({
      url: '/pages/preview/preview?area_code=' + this.data.area_code + '&narrator_code=' + this.data.narrator_code + '&price=' + this.data.narrator.price
    })
  }
})