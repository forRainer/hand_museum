// pages/goods_tickets_use/goods_tickets_use.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_info: null,
        tickets_list: null,
        tickets_count: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        var out_trade_no = options.out_trade_no
        console.log('out_trade_no', out_trade_no)
        var order_info = null
        const eventChannel = that.getOpenerEventChannel()
        eventChannel.on('sendDataToPage', function(data) {
            console.log('data',data)
            order_info = data
        })
        wx.request({
            url: app.globalData.server_address + "/mall/get_tickets_list",
            data: {
                out_trade_no: out_trade_no
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function(res) {
              console.log('/mall/get_tickets_list', res.data)
              that.setData({
                order_info: order_info,
                tickets_list: res.data.tickets_list,
                tickets_count: res.data.tickets_count
              })
              console.log(that.data)
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

    }
})