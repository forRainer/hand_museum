// pages/demo1/demo1.js
var bgMusic = new Array()
var wait_flag = new Array()
const app = getApp()
var current_index_1 = 1
var current_index_2 = 1
var current_music_id = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPayed: true,
    pay_status: -1,
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
    content_list: 0,
    total_duration: 0,
    title_count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      area_code: options.area_code,
      narrator_code: options.narrator_code,
      pay_status: options.pay_status
    })
    wx.request({
      url: app.globalData.server_address + '/narrator',
      data: {
        area_code: that.data.area_code,
        narrator_code: that.data.narrator_code,
        user_id: app.globalData.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('narrator', res.data)
        let narrator_name = 'narrator.name';
        let narrator_title = 'narrator.title';
        let narrator_img_url = 'narrator.img_url';
        let narrator_price = 'narrator.price';
        let narrator_score = 'narrator.score';
        let narrator_explain_overview = 'narrator.explain_overview';
        let narrator_slogan = 'narrator.slogan'
        that.setData({
          [narrator_name]: res.data.narrator_info.name,
          [narrator_title]: res.data.narrator_info.title,
          [narrator_img_url]: res.data.narrator_info.img_url,
          [narrator_price]: res.data.narrator_info.price,
          [narrator_score]: res.data.narrator_info.score,
          [narrator_explain_overview]: res.data.narrator_info.explain_overview,
          [narrator_slogan]: res.data.narrator_info.slogan,
          title_count: res.data.title_count,
          content_count: res.data.content_count,
          content_list: res.data.content_list,
          isPayed: res.data.is_payed,
          total_duration: res.data.total_duration
        })
        for(var i = 0; i < that.data.content_count; ++i){
          bgMusic[i] = 0;
          wait_flag[i] = false;
        }
        console.log('this_data', that.data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('pay_status', this.data.pay_status)
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
    console.log('listenerButtonPlay')
    console.log(e.currentTarget.dataset)
    var index_1 = e.currentTarget.dataset.index_1+1;
    var index_2 = e.currentTarget.dataset.index_2;
    var id = e.currentTarget.dataset.id;
    var that = this;
    var content_list_tmp = that.data.content_list

    if(bgMusic[id] == 0){
      bgMusic[id] = wx.createInnerAudioContext();
    }

    // 把当前正在播放的停了
    content_list_tmp[current_index_1]['list'][current_index_2].is_open = false
    if(bgMusic[current_music_id] != 0) {
      bgMusic[current_music_id].pause()
    }
    console.log(bgMusic[current_music_id].paused)
    that.setData({
      content_list: content_list_tmp
    })
    current_index_1 = index_1;
    current_index_2 = index_2;
    current_music_id = id;

    //bug ios 播放时必须加title 不然会报错导致音乐不播放
    bgMusic[id].title = '绍兴古城' + id
    bgMusic[id].epname = '绍兴古城' + id
    console.log('x21900', index_1, index_2, content_list_tmp)
    bgMusic[id].src = content_list_tmp[index_1]['list'][index_2].audio_url;

    bgMusic[id].onTimeUpdate(() => {
      console.log(bgMusic[id].paused)
      //bgMusic.duration总时长  bgMusic.currentTime当前进度
      console.log('onTimeUpdate')
      var currentTime = parseInt(bgMusic[id].currentTime);
      var min = "0" + parseInt(currentTime / 60);
      var max = parseInt(bgMusic[id].duration);
      var sec = currentTime % 60;
      if (sec < 10) {
        sec = "0" + sec;
      };
      var starttime = min + ':' + sec;   /*  00:00  */
      content_list_tmp[index_1]['list'][index_2].offset = currentTime;
      console.log('currentTime', currentTime)
      content_list_tmp[index_1]['list'][index_2].start_time = starttime;
      content_list_tmp[index_1]['list'][index_2].max = max;
      console.log('max', max)
      content_list_tmp[index_1]['list'][index_2].changePlay = true;
      that.setData({
        content_list: content_list_tmp
      })
    })

    //播放结束
    bgMusic[id].onEnded(() => {
      content_list_tmp[index_1]['list'][index_2].start_time = '0:00'
      content_list_tmp[index_1]['list'][index_2].is_open = false
      content_list_tmp[index_1]['list'][index_2].offset = 0
      that.setData({
        content_list: content_list_tmp
      })
      console.log("音乐播放结束");
    })
    
    bgMusic[id].play();
    setTimeout(() => {
      // 必须要这么一句
      console.log(bgMusic[id].paused)
    }, 100)
    content_list_tmp[index_1]['list'][index_2].is_open = true
    that.setData({
      content_list: content_list_tmp
    })
  },
  //暂停播放
  listenerButtonPause(e){
    console.log('listenerButtonPause')
    var index_1 = e.currentTarget.dataset.index_1+1;
    var index_2 = e.currentTarget.dataset.index_2;
    var id = e.currentTarget.dataset.id;
    var that = this;
    var content_list_tmp = that.data.content_list
    content_list_tmp[index_1]['list'][index_2].is_open = false
    bgMusic[id].pause()
    that.setData({
      content_list: content_list_tmp
    })
  },
  // 停止所有音乐播放
  listenerButtonStop(){
    var that = this
    for(var i = 0; i < that.data.content_count; ++i){
      if(bgMusic[i] != 0){
        bgMusic[i].stop();
      }
    }
  },
  // 进度条拖拽
  sliderChange(e) {
    console.log('sliderChange')
    var that = this
    var index_1 = e.currentTarget.dataset.index_1+1;
    var index_2 = e.currentTarget.dataset.index_2;
    var id = e.currentTarget.dataset.id;

    var content_list_tmp = that.data.content_list
    var offset = parseInt(e.detail.value);
    content_list_tmp[index_1]['list'][index_2].is_open = true;
    content_list_tmp[index_1]['list'][index_2].offset = offset;
    bgMusic[id].play();
    setTimeout(() => {
      console.log(bgMusic[id].paused)
    }, 100)
    bgMusic[id].seek(offset);
    that.setData({
      content_list: content_list_tmp
    })
  },

  jumpToPreview: function (e) {
    wx.redirectTo({
      url: '/pages/preview/preview?area_code=' + this.data.area_code + '&narrator_code=' + this.data.narrator_code + '&price=' + this.data.narrator.price
    })
  },

  previewImage: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src]
    })
  }
})