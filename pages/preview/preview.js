// pages/preview/preview.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: 0.00,
    area_code: 0,
    narrator_code: 0,
    area_name: 0,
    narrator_name: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      price: options.price,
      area_code: options.area_code,
      narrator_code: options.narrator_code
    })
    wx.request({
      url: app.globalData.server_address + '/preview',
      data: {
        area_code: that.data.area_code,
        narrator_code: that.data.narrator_code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          narrator_name: res.data.narrator_name,
          area_name: res.data.area_name
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

  jumpBack: function (e) {
    wx.redirectTo({
      url: '/pages/narrator/narrator?pay_status=' + e.currentTarget.dataset.flag + '&area_code=' + this.data.area_code + '&narrator_code=' + this.data.narrator_code
    })
  },

  goPay: function (e) {
    var that = this;
    var pay_status = null; // 1表示取消支付， 2表示支付成功
    // 先调用微信支付接口


    // 再向后台发送订单
    wx.request({
      url: app.globalData.server_address + '/insert_order',
      data: {
        area_code: that.data.area_code,
        narrator_code: that.data.narrator_code,
        user_id: app.globalData.userId,
        price: that.data.price
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('insert 21900', res)
        pay_status = res.data.pay_status;
        wx.redirectTo({
          url: '/pages/narrator/narrator?pay_status=' + pay_status + '&area_code=' + that.data.area_code + '&narrator_code=' + that.data.narrator_code
        })
      }
    })
  },
})