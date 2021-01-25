// pages/login/login.js
const app = getApp()
const api = app.globalData.api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    codeText: "获取验证码",
    phone: '',
    code: '',
    password: '',
    isTapSend: true,
    timer: null,

  },
  bindInput: function (e) {
    var that = this
    that.setData({
      phone: e.detail.value,
    })
  },
  bindInput2: function (e) {
    var that = this
    that.setData({
      password: e.detail.value,
    })
  },
  sendCodeFn() {
    var that = this
    if (that.data.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var myreg = /^[1][0-9]{10}$/
    if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (!that.data.isTapSend) {
      return
    }
    that.setData({
      isTapSend: false,
    })

    var num = 61;
    that.timer = setInterval(() => {
      num--;
      if (num <= 0) {
        clearInterval(that.timer);
        that.setData({
          codeText: '重新发送',
          isTapSend: true
        })
      } else {
        that.setData({
          isTapSend: false,
          codeText: num + "s",
        })
      }
    }, 1000)
    wx.request({
      url: api + '/api/common/sendSms',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      data: {
        phone: that.data.phone
      },
      success: (res) => {
        if (res.data.code == 1) {

        } else {
          clearInterval(that.timer);
          that.setData({
            codeText: '重新发送',
            isTapSend: true
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: "网络出错,请稍后重试",
          icon: 'none'
        })
        that.setData({
          isTapSend: true
        })
      }
    })
  },
  bindInputCode: function (e) {
    var that = this
    that.setData({
      code: e.detail.value,
    })
  },

  opentoBtn() {

    var that = this
    if(!that.data.phone||!that.data.code||!that.data.password){

      wx.showToast({
        title: '请完善信息',
        icon: 'none'
      })

      return
    }



    wx.request({
      url: api + '/api/Customers/resetting',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      data: {
        phone: that.data.phone,
        code: that.data.code,
        password: that.data.password,

      },
      success: (res) => {
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '../login',
            })
          }, 300)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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