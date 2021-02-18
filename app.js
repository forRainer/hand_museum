//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.request({
      url: this.globalData.server_address + '/get_app_info',
      success: (res) => {
        console.log('get_app_info', res)
        this.globalData.appId = res.data.app_id;
        this.globalData.appSecret = res.data.app_secret;
      }
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('login', res);
        if(res.code){
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + this.globalData.appId + '&secret=' + this.globalData.appSecret + '&js_code=' + res.code + '&grant_type=authorization_code',
            success: (res2) => {
              console.log('jscode2session', res2)
              this.globalData.sessionKey = res2.data.session_key;
              this.globalData.openId = res2.data.openid;
              this.globalData.userId = res2.data.openid;
              if(this.globalData.userId){
                this.globalData.isLogin = true;
                console.log('user login')
              }
            }
          })
        }

        // 获取用户信息，必须放在登录回调内部
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  this.globalData.userInfo = res.userInfo
                  console.log('getUserInfo', res)
                  // 可以将 res 发送给后台解码出 unionId
                  wx.request({
                    url: this.globalData.server_address + '/get_unionId',
                    data: {
                      appId: this.globalData.appId,
                      sessionKey: this.globalData.sessionKey,
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
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }
        })
      
      }
    })

    var that = this
    setTimeout(function() {
      that.showPermissionModal();
    }, 1500)
  },
  
  showPermissionModal: function() {
    console.log('定时器唤醒')
    var that = this
    if (that.globalData.userInfo) {
      that.globalData.hasUserInfo = true
    }
    console.log('has user info', that.globalData.hasUserInfo)
    console.log('canIUse', that.globalData.canIUse)
    if (!that.globalData.hasUserInfo && that.globalData.canIUse) {
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

  globalData: {
    userInfo: null,
    server_address: 'http://47.114.120.151',
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