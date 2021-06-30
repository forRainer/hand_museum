// pages/orders/orders.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_count: 0,
    order_list: null,
    current_tab: 1,
    mall_order_count: 0,
    mall_order_list: null
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
        var show_tab = that.data.current_tab
        if(res.data.order_count>0){
          show_tab = 0
        }
        that.setData({
          order_count: res.data.order_count,
          order_list: res.data.order_list,
          current_tab: show_tab
        })
      }
    })
    wx.request({
      url: app.globalData.server_address + "/mall/get_order_list",
      data: {
        user_id: app.globalData.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('/mall/get_order_list', res.data)
        that.setData({
          mall_order_count: res.data.order_count,
          mall_order_list: res.data.order_list,
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
  },

  changeTab: function(e) {
    var tab = e.currentTarget.dataset.tab
    this.setData({
      current_tab: tab
    })
  },

  // 跳转到门票页面
  jumpToTicketsUse: function(e) {
    var that =this
    var index = e.currentTarget.dataset.index
    var out_trade_no = that.data.mall_order_list[index].out_trade_no
    wx.navigateTo({
      url: '../../pages/goods_tickets_use/goods_tickets_use?out_trade_no='+out_trade_no,
      success: function(res){
        res.eventChannel.emit('sendDataToPage', that.data.mall_order_list[index])
      }
    })
  },

  refundOrder: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var mall_order_list_tmp = that.data.mall_order_list
    var out_trade_no = mall_order_list_tmp[index].out_trade_no
    wx.request({
      url: app.globalData.server_address + "/mall/refund_order",
      data: {
        out_trade_no: out_trade_no,
        user_id: app.globalData.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: "已登记，等待管理员审核", // 提示的内容
          icon: "none"
        })
        mall_order_list_tmp[index].status_desc = '退款中'
        mall_order_list_tmp[index].status = 1
        that.setData({
          mall_order_list: mall_order_list_tmp
        })
      }
    })

  }
})