// pages/goods_confirm_tickets/goods_confirm_tickets.js
const util = require("../../utils/util.js")
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        num: 0,
        goods_id: 0,
        spec_id_0: null,
        spec_id_1: null,
        goods_name: null,
        spec_value_0: null,
        spec_value_1: null,
        price: null,
        contacts: null,
        tel: null,
        visitor_list: [],
        attraction_list: null,
        select_attraction: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        var goods_id = options.goods_id
        var num = Number(options.num)
        var spec_id_0 = options.spec_id_0
        var spec_id_1 = options.spec_id_1
        var goods_name = options.goods_name
        var spec_value_0 = options.spec_value_0
        var spec_value_1 = options.spec_value_1
        var price = Number(options.price)
        that.setData({
            num: num,
            goods_id: goods_id,
            spec_id_0: spec_id_0,
            spec_id_1: spec_id_1,
            goods_name: goods_name,
            spec_value_0: spec_value_0,
            spec_value_1: spec_value_1,
            price: price
        })
        for(var i = 0; i < num;i++){
            var visitor = {"name": null, "idcard": null}
            that.data.visitor_list.push(visitor)
        }
        wx.request({
            url: app.globalData.server_address + '/mall/get_goods_attraction_relation',
            data: {
                goods_id: goods_id,
                spec_id: spec_id_1,
                user_id: app.globalData.userId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(21900, res)
                if(res.data.has_attraction == true){
                    var select_attraction_tmp = []
                    for(var index in res.data.list){
                        var node = {}
                        node.attraction_code = res.data.list[index].attraction_code
                        node.narrator_code = res.data.list[index].narrator_list[0].narrator_code
                        node.narrator_name = res.data.list[index].narrator_list[0].narrator_name
                        select_attraction_tmp.push(node)
                    }
                    that.setData({
                        attraction_list: res.data.list,
                        select_attraction: select_attraction_tmp
                    })
                }
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

    inputContacts: function(e){
        var that = this
        console.log(e)
        that.data.contacts = e.detail.value
    },

    inputTel: function(e){
        var that = this
        var tel = e.detail.value
        if (!util.verifyTel(tel)) {
            wx.showToast({
                title: '手机号码有误',
                duration: 1200,
                icon:'none'
            })
            that.data.tel = null
            return false
        }
        that.data.tel = tel
    },

    inputIdcard: function(e){
        var that = this
        console.log(e)
        var idcard = e.detail.value
        var index = Number(e.currentTarget.dataset.index)
        if(!util.verifyIdcard(idcard)){
            wx.showToast({
                title: '身份证号码有误',
                duration: 1200,
                icon:'none'
            })
            that.data.visitor_list[index].idcard = null
            return false
        }
        that.data.visitor_list[index].idcard = idcard
    },

    inputName: function(e){
        var that = this
        console.log(e)
        var name = e.detail.value
        var index = Number(e.currentTarget.dataset.index)
        if(!util.verifyCnname(name)){
            wx.showToast({
                title: '姓名有误',
                duration: 1200,
                icon:'none'
            })
            that.data.visitor_list[index].name = null
            return false
        }
        that.data.visitor_list[index].name = name
    },

    checkInfo: function(){
        var that = this
        if(that.data.contacts==null||that.data.tel==null){
            return false
        }
        for(var i = 0; i < that.data.num; i++){
            if(that.data.visitor_list[i].name==null||that.data.visitor_list[i].idcard==null){
                return false
            }
        }
        return true
    },

    goPay: function(e){
        var that = this
        console.log(app.globalData)
        if(!that.checkInfo()){
            wx.showToast({
                title: '信息不全',
                duration: 1200,
                icon:'none'
            })
            return
        }

        wx.request({
            url: app.globalData.server_address + '/wx_pay',
            data: {
                user_id: app.globalData.userId,
                price: that.data.price
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res)
                wx.requestPayment({
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: res.data.package,
                    signType: res.data.signType,
                    paySign: res.data.paySign,
                    success: function (res2) {
                        console.log('pay success', res2)
                        that.insertOrder(res.data.out_trade_no)
                        that.jumpToOrderList(res.data.out_trade_no)
                    },
                    fail: function (res3) {
                        console.log('pay fail', res3)
                        wx.showToast({
                            title: res3.errMsg,
                            duration: 2000,
                            icon:'none'
                        })
                    }
                })
            }
        })
    },

    insertOrder: function(out_trade_no) {
        var that = this
        var desc = that.data
        delete desc.__webviewId__
        delete desc.attraction_list
        wx.request({
            url: app.globalData.server_address + "/mall/insert_order",
            data: {
                user_id: app.globalData.userId,
                out_trade_no: out_trade_no,
                desc_json: JSON.stringify(desc)
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                console.log('/mall/insert_order', res.data)
            }
        })
    },

    // 跳转到门票页面
    jumpToOrderList: function(out_trade_no) {
        wx.redirectTo({
          url: '../../pages/orders/orders'
        })
    },

    bindPickerChange: function(e){
        var that = this
        var attraction_index = e.currentTarget.dataset.attraction_index
        var narrator_index = e.detail.value
        var attraction_code = that.data.attraction_list[attraction_index].attraction_code
        var narrator_code = that.data.attraction_list[attraction_index].narrator_list[narrator_index].narrator_code
        var select_attraction_tmp = that.data.select_attraction
        select_attraction_tmp[attraction_index] = {}
        select_attraction_tmp[attraction_index].attraction_code = attraction_code
        select_attraction_tmp[attraction_index].narrator_code = narrator_code
        select_attraction_tmp[attraction_index].narrator_name = that.data.attraction_list[attraction_index].narrator_list[narrator_index].narrator_name
        that.setData({
            select_attraction: select_attraction_tmp
        })
        console.log('select_attraction', select_attraction_tmp)
    }
})