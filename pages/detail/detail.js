// pages/detail/detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    area_code: 0,
    narrator_count: 0,
    narrator_list: 0,
    area_name: 0,
    introduction: 0,
    area_img_url: 0,
    address: 0,
    lng: 0,
    lat: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      area_code: options.area_code
    })
    var app = getApp();
    wx.request({
      url: app.globalData.server_address + '/detail',
      data: {
        area_code: that.data.area_code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('detail', res.data)
        that.setData({
          narrator_count: res.data.narrator_count,
          narrator_list: res.data.narrator_list,
          area_name: res.data.attraction_info.name,
          introduction: res.data.attraction_info.introduction,
          area_img_url: res.data.attraction_info.img_url,
          address: res.data.attraction_info.address,
          lng: res.data.attraction_info.lng,
          lat: res.data.attraction_info.lat
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  jumpTo: function (e) {
    wx.navigateTo({
      url: '/pages/narrator/narrator?area_code='+this.data.area_code+'&narrator_code=' + e.currentTarget.dataset.code
    })
  },

   //点击地址调用地图
   call_map: function () {
     var name = this.data.area_name;
     var address = this.data.address;
     var jingdu = this.data.lng;
     var weidu = this.data.lat;
     app.callMap(name, address, jingdu, weidu);
   }
})