// pages/orders/orders.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_count: 0,
    order_list: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 发送获取订单请求
    var that = this;
    wx.request({
      url: app.globalData.server_address + "/get_orders",
      data: {
        user_id: app.globalData.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('get_orders', res.data)
        that.setData({
          order_count: res.data.order_count,
          order_list: res.data.order_list,
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

  // 跳到详情页面
  jumpTo: function (e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/narrator/narrator?area_code='+this.data.order_list[index].attraction_code+'&narrator_code=' + this.data.order_list[index].narrator_code
    })
  }
})