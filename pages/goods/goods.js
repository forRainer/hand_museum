// pages/goods/goods.js
const app = getApp()
const util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_user_info_ready: app.userInfoReady(),
    animation: null,
    animation_p: null,
    chooseSize: false,
    screen_height: wx.getSystemInfoSync().windowHeight,
    current_tab: 0,
    to_view: null,
    scroll_list: ["goods", "detail"],

    goods_id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.animation = wx.createAnimation()
    that.animation_p = wx.createAnimation()
    that.setData({
      is_user_info_ready: app.userInfoReady()
    })

    that.data.goods_id = options.goods_id
    wx.request({
      url: app.globalData.server_address + "/mall/get_goods_list",
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('/mall/get_goods_list', res.data)
        that.setData({
          goods_list: res.data.list
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

  getUserInfo: function(e) {
    var that = this
    console.log('getUserInfo', app.userInfoReady())
    if(!app.userInfoReady()){
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      app.onLaunch()
      wx.showToast({
        title: '同步中',
        icon: 'loading',
        duration: 2000
      })
      setTimeout(function(){
        that.setData({
          is_user_info_ready: app.userInfoReady()
        });
        that.showSize(0)
        that.hidePermission(0)
        console.log('is user info ready', that.data.is_user_info_ready);
      }, 2000)
    }else{
      that.setData({
        is_user_info_ready: app.userInfoReady()
      })
      that.hidePermission(0)
    }
  },

  showSize: function(e) {
    console.log('showSize')
    var that = this
    that.animation.translate(0, -util.getPx(667)).step()
    that.setData({
      animation: that.animation.export(),
      chooseSize: true
    })
  },

  hideSize: function(e) {
    console.log('hideSize')
    var that = this
    that.animation.translate(0, util.getPx(667)).step()
    that.setData({
      animation: that.animation.export(),
      chooseSize: false
    })
  },

  showPermission: function(e) {
    console.log('showPermission')
    var that = this
    that.animation_p.translate(0, -util.getPx(300)).step()
    that.setData({
      animation_p: that.animation_p.export(),
    })
  },

  hidePermission: function(e) {
    console.log('hidePermission')
    var that = this
    that.animation_p.translate(0, util.getPx(300)).step()
    that.setData({
      animation_p: that.animation_p.export(),
    })
  },

  showSizeOrPermission: function(e) {
    var that = this
    if(!that.data.is_user_info_ready){
      that.showPermission(0);
    } else {
      that.showSize(0);
    }
  },

  viewJump: function(e) {
    var tab = e.currentTarget.dataset.tab;
    console.log(this.data.scroll_list[tab])
    this.setData({
      to_view: this.data.scroll_list[tab],
      current_tab: tab
    })
  },

  getUserProfile: function() {
    var that = this
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        app.globalData.hasUserInfo = true
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })

    var that = this
    console.log('getUserInfo', app.userInfoReady())
    if(!app.userInfoReady()){
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          app.globalData.userInfo = res.userInfo
          app.globalData.hasUserInfo = true
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      app.onLaunch()
      wx.showToast({
        title: '同步中',
        icon: 'loading',
        duration: 2000
      })
      setTimeout(function(){
        that.setData({
          is_user_info_ready: app.userInfoReady()
        });
        that.showSize(0)
        that.hidePermission(0)
        console.log('is user info ready', that.data.is_user_info_ready);
      }, 2000)
    }else{
      that.setData({
        is_user_info_ready: app.userInfoReady()
      })
      that.hidePermission(0)
    }

  }
})