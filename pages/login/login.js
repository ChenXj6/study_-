// pages/login/login.js
const app = getApp()
const api = app.globalData.api
Page({
  /**
   * 页面的初始数据
   */
  data: {

    phone: '',
    code: '',
    codeText: "获取验证码",
    isTapSend: true,
    wxLoginData: "",
    showPhoneBtn: 0,
    password: '',

  },
  navForget() {


    wx.navigateTo({
      url: './forget/forget',
    })

  },
  // gosignUp() {



  //   wx.navigateTo({
  //     url: './sign-up/sign-up',
  //   })
  // },
  bindInput: function (e) {
    var that = this
    that.setData({
      phone: e.detail.value,
    })
  },

  bindpassword: function (e) {
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
          var num = 61;
          var timer = setInterval(() => {
            num--;
            if (num <= 0) {
              clearInterval(timer);
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
        } else {
          that.setData({
            isTapSend: true
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        that.setData({
          isTapSend: true
        })
      }
    })
  },
  categoryFn() {
    var that = this


    return new Promise((resolve, reject) => {



      var param = {
        url: '/api/Index_categories/index',
      }
      app.http(param).then((res) => {
        var data = res.data.data
        wx.setStorageSync('xiaofang_has_class', data.has_class) //把xiaofang_id保存起来，别的页面需要
        wx.setStorageSync('xiaofang_id', data.list[0].id) //把xiaofang_id保存起来，别的页面需要
        wx.setStorageSync('xiaofang_user_name', data.list[0].name) //
        resolve()



      }).catch(err => {
        // 具体参考 reject()
        if (err == 'session已更新') {
          that.categoryFn() //重新调用该函数
        }else{
          reject()
        }
      })









    })



  },
  opentoBtn() {
    var that = this



    if (!that.data.phone || !that.data.password) {
      wx.showToast({
        title: '请完善信息',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '登录中',
      mask: true,
    })

    wx.request({
      url: api + '/api/Customers/login',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      data: {
        phone: that.data.phone,
        // code: that.data.code,
        password: that.data.password,
      },
      success: (res) => {
        if (res.data.code == 1) {
          wx.setStorageSync('xiaofang_session', 'PHPSESSID=' + res.data.data)
          wx.setStorageSync('xiaofang_phone', that.data.phone)
          that.categoryFn().then(thens => {
            wx.hideLoading()
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            wx.navigateBack({})
          }).catch(err=>{
            wx.hideLoading()
            wx.navigateBack()

          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: "网络出错,请稍后重试",
          icon: 'none'
        })
      }
    })
  },

  wxLogin: function (e) {
    var that = this
    wx.showLoading({
      title: '登录中',
      mask: true,
    })
    wx.login({
      success(res) {
        var code = res.code
        wx.request({
          url: api + '/api/wxchat/login',
          method: "post",
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          data: {
            code: code
          },
          success: function (res) {
            wx.hideLoading()
            if (res.code == 0) {
              wx.showModal({
                title: '提示',
                content: '微信授权失败',
              })
              return false
            }
            if (res.data.data.is_exists == 1) {
              //微信授权登录，用户已注册，可以直接登陆
              wx.setStorageSync('xiaofang_phone', res.data.data.phone)
              wx.setStorageSync('xiaofang_session', 'PHPSESSID=' + res.data.data.session_id)
              that.categoryFn().then(thens => {

                wx.navigateBack()
              }).catch(err=>{

                wx.navigateBack()

              })
            } else { //获取手机号码进行注册
              that.setData({
                wxLoginData: res.data.data,
                showPhoneBtn: 1
              });
              wx.showToast({
                title: '请继续点击下方获取手机号按钮',
                icon: 'none',
              })
            }
          },
          fail:(err)=>{
            wx.hideLoading()

            wx.showToast({
              title: '网络出错,请稍后重试',
              icon: 'none',
            })

          }
        })
      }
    })
  },

  getPhoneNumber: function (e) {
    wx.showLoading({
      title: '登录中',
      mask: true,
    })
    var that = this;

    // console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: api + '/api/wxchat/getPhone',
        data: {
          encryptedData: encodeURIComponent(e.detail.encryptedData),
          iv: e.detail.iv,
          sessionKey: that.data.wxLoginData.session_key,
          openid: that.data.wxLoginData.openid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: "post",
        success: function (res) {
          wx.hideLoading()
          if (res.data.code == 1) {
            // 已获取手机号
            wx.setStorageSync('xiaofang_phone', res.data.data.phone)
            wx.setStorageSync('xiaofang_session', 'PHPSESSID=' + res.data.data.session_id)
            wx.showToast({
              title: '请完善个人信息',
              icon: 'none',
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '../user/set/set',
              })
            }, 500)
          } else {
            wx.showToast({
              title: '请点击下方获取手机号按钮',
              icon: 'none',
            })
          }
        },
        fail: (err) => {
          wx.hideLoading()
          wx.showToast({
            title: "网络出错,请稍后重试",
            icon: 'none'
          })
        }
      })
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '请授权手机号',
        icon: 'none',
      })
      return false
    }
  },
  openidFn() {
    var that = this
    wx.login({
      success: res => {
        var code = res.code
        wx.request({
          url: api + '/api/wxchat/updateCustomerOpenid',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': wx.getStorageSync('appid')
          },
          method: 'POST',
          data: {
            code: code
          },
          success: (res) => {
            // if (res.data.code == 1) {

            // } else {
            //   wx.showToast({
            //     title: res.data.msg,
            //     icon: 'none'
            //   })
            // }
          }
        })
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
    wx.setStorageSync('xiaofang_login', '1')
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