// pages/demo/demo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area_count: 0,
    area_list: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    top_img_list: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.server_address + "/all",
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('get_all', res.data)
        that.setData({
          area_count: res.data.count,
          area_list: res.data.list,
          top_img_list: res.data.top_img_list
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  showPermissionModal: function() {
    var that = this
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log('has user info', that.data.hasUserInfo)
    }
    console.log('hasUserInfo', that.data.hasUserInfo)
    console.log('canIUse', that.data.canIUse)
    if (!that.data.hasUserInfo && that.data.canIUse) {
      wx.showModal({
        title: '未授权提醒',
        content: '用户尚未授权，请先到“我的”页面点击“获取头像昵称”',
        success: function (res) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    setTimeout(function() {
      that.showPermissionModal();
    }, 1000)
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
      url: '/pages/detail/detail?area_code='+e.currentTarget.dataset.code
    })
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


})