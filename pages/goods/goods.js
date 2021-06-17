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

    goods_id: 0,
    img_list: 0,
    spec_list: 0,
    goods_info: 0,

    spec_index_0: 0,
    spec_index_1: 0,

    num: 0
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

    // 获取图片
    that.data.goods_id = options.goods_id
    wx.request({
      url: app.globalData.server_address + "/mall/get_goods_img",
      data: {
        goods_id: that.data.goods_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('/mall/get_goods_img', res.data)
        that.setData({
          img_list: res.data.img_list
        })
      }
    })

    // 获取规格
    wx.request({
      url: app.globalData.server_address + "/mall/get_goods_spec",
      data: {
        goods_id: that.data.goods_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('/mall/get_goods_spec', res.data)
        var num = 0
        if(res.data.spec_list[0]['list'][0].stock > 0){
          num = 1
        }
        that.setData({
          spec_list: res.data.spec_list,
          num: num
        })
      }
    })

    //获取基本信息
    wx.request({
      url: app.globalData.server_address + "/mall/get_goods_info",
      data: {
        goods_id: that.data.goods_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('/mall/get_goods_info', res.data)
        that.setData({
          goods_info: res.data
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
    var that = this;
    var opt = {};
    opt.goods_id = that.data.goods_id;
    that.onLoad(opt);
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
    var that = this
    console.log('user info', app.globalData.userInfo)
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        app.globalData.hasUserInfo = true
        wx.setStorageSync('userInfo',app.globalData.userInfo)
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
      }
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
  },

  previewImg: function(e){
    var that = this
    var index = e.currentTarget.dataset.index
    wx.previewImage({
      current: that.data.img_list[index], // 当前显示图片的http链接
      urls: that.data.img_list // 需要预览的图片http链接列表
    })
  },

  chooseSpec0: function(e){
    var that = this
    var index_0 = e.currentTarget.dataset.index_0
    var index_1 = that.data.spec_index_1
    var num = 0
    if(that.data.spec_list[index_0]['list'][index_1].stock>0){
      num = 1
    }
    that.setData({
      spec_index_0: index_0,
      num: num
    })
  },

  chooseSpec1: function(e){
    var that = this
    var index_1 = e.currentTarget.dataset.index_1
    var index_0 = that.data.spec_index_0
    var num = 0
    if(that.data.spec_list[index_0]['list'][index_1].stock>0){
      num = 1
    }
    that.setData({
      spec_index_1: index_1,
      num: num
    })
  },

  add: function(e){
    var that = this
    var index_1 = that.data.spec_index_1
    var index_0 = that.data.spec_index_0
    if(that.data.num < that.data.spec_list[index_0]['list'][index_1].stock){
      that.setData({
        num: that.data.num + 1
      })
    }
  },

  min: function(e){
    var that = this
    if(that.data.num > 1){
      that.setData({
        num: that.data.num - 1
      })
    }
  },

  jumpToConfirm: function(e){
    var that = this
    var num = that.data.num
    if(num==0){
      wx.showToast({  
        title: '数量不能为0',  
        icon: 'none',  
        duration: 1200  
      })
      return
    }
    var goods_id = that.data.goods_id
    var index_1 = that.data.spec_index_1
    var index_0 = that.data.spec_index_0
    var spec_id_0 = that.data.spec_list[0]['list'][index_0].spec_id
    var spec_id_1 = that.data.spec_list[1]['list'][index_1].spec_id
    var goods_name = that.data.goods_info.goods_name
    var spec_value_0 = that.data.spec_list[0]['list'][index_0].value
    var spec_value_1 = that.data.spec_list[1]['list'][index_1].value
    var price = num*that.data.spec_list[1]['list'][index_1].price
    console.log('jumpToConfirm')
    wx.navigateTo({
      url: '/pages/goods_confirm_tickets/goods_confirm_tickets?goods_id='+goods_id+'&spec_id_0='+spec_id_0+'&spec_id_1='+spec_id_1+'&num='+num+'&goods_name='+goods_name+'&spec_value_0='+spec_value_0+'&spec_value_1='+spec_value_1+'&price='+price
    })
  }
})
