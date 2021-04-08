//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)
    that.globalData.userInfo = wx.getStorageSync('userInfo')
    wx.request({
      url: that.globalData.server_address + '/get_app_info',
      success: (res) => {
        console.log('get_app_info', res)
        that.globalData.appId = res.data.app_id;
        that.globalData.appSecret = res.data.app_secret;
        that.mylogin();
      }
    })

  },
  
  mylogin: function(){
    var that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('login', res);
        if(res.code){
          wx.request({
            url: that.globalData.server_address + '/jscode2session?appid=' + this.globalData.appId + '&secret=' + this.globalData.appSecret + '&js_code=' + res.code + '&grant_type=authorization_code',
            success: (res2) => {
              console.log('jscode2session', res2)
              that.globalData.sessionKey = res2.data.session_key;
              that.globalData.openId = res2.data.openid;
              that.globalData.userId = res2.data.openid;
              if(that.globalData.userId){
                that.globalData.isLogin = true;
                console.log('user login')
              }
              console.log('globalData', that.globalData)
            }
          })
        }

        // 获取用户信息，必须放在登录回调内部
        /*wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserProfile 获取头像昵称，不会弹框
              wx.getUserProfile({
                desc: '用于完善会员资料',
                success: res => {
                  that.globalData.userInfo = res.userInfo
                  console.log('getUserInfo', res)
                  // 可以将 res 发送给后台解码出 unionId
                  wx.request({
                    url: that.globalData.server_address + '/get_unionId',
                    data: {
                      appId: that.globalData.appId,
                      sessionKey: that.globalData.sessionKey,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded' // 必须这么写
                    },
                    success: (res2) => {
                      console.log('get_unionId', res2)
                    }
                  })
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }
        })
        */
      }
    })
  },

  // 目前不使用
  showPermissionModal: function() {
    console.log('定时器唤醒')
    var that = this
    if (that.globalData.userInfo) {
      that.globalData.hasUserInfo = true
    }
    console.log('has user info', that.globalData.hasUserInfo)
    console.log('canIUse', that.globalData.canIUse)
    if (!that.userInfoReady()) {
      wx.showModal({
        title: '未授权提醒',
        content: '用户尚未授权，请先到“我的”页面点击“点此授权”按钮',
        success: function (res) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    }
  },

  userInfoReady: function() {
    var that = this
    if (that.globalData.userInfo) {
      that.globalData.hasUserInfo = true
    }
    console.log('globalData', that.globalData)
    if (!that.globalData.hasUserInfo && that.globalData.canIUse){
      return false
    }else{
      return true
    }
  },

  callMap: function(name, address, jingdu, weidu){
    wx.getLocation({
      //定位类型 wgs84, gcj02
      // wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
      type: 'gcj02',
      //获取位置成功
      success: function (res) {
        console.log(res)  //获取的的当前位置的详细信息
        wx.openLocation({
          //当前经纬度
          latitude: weidu,  // 纬度
          longitude: jingdu,  // 经度
          //缩放级别默认18,缩放比例为5-18
          scale: 18,
          //位置名
          name: name,
          //详细地址
          address: address,
          //成功打印信息
          success: function (res) {
              
          },
          //失败打印信息
          fail: function (err) {
            wx.showToast({
              title: '调用地图失败，请返回重试',
            })
          },
        })
  
      },
      //获取位置失败
      fail: function (err) {
        console.log("获取位置信息失败，请返回重试")
      },
      //接口调用结束的回调函数（调用成功、失败都会执行）
      complete: function (info) {
        console.log("完成")
      },
    })
  },

  globalData: {
    userInfo: null,
    server_address: 'https://onlineexpound.sxhttour.com',
    appId: '',
    appSecret: '',
    sessionKey: null,
    openId: null,
    userId: null,
    isLogin: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: null
  }
})