// pages/cook-item-sub/cook-item-sub.js
const app = getApp()
const api = app.globalData.api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    hidden: false,
    logingText: '加载中...',
    threeActive: '', //分类id,初中高
    listData1: [],

    new_ids:'',//用来解决重复点击的问题
    new_id1:'', //章节列表用到的id
    new_id2: '', //章节列表用到的id
    isshow:true,
    vip:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
 
    this.getListFn()

  },
  openVipFn(){
    wx.navigateTo({
      url: '../member/member',
    })
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    var that = this
    if (that.data.hidden == false) {
      return;
    }
    that.data.page++
    that.getListFn()
  },

  // 章节列表
  getListFn() {


    var that=this
    var param = {
      url: '/api/subjects/getTrueNameList',
      data: {
        page: that.data.page,
      },
    }
    app.http(param).then((res) => {
      if (res.data.data.list.data.length != 0) {
        that.setData({
          hidden: true,
          logingText: '加载中...'
        })
        if (that.data.page == 1) {
          that.setData({
            listData1: res.data.data.list.data,
          });
        } else {
          var list = that.data.listData1;
          that.setData({
            listData1: list.concat(res.data.data.list.data),
          });
        }
        if (that.data.page >= res.data.data.list.last_page) {
          that.setData({
            logingText: '---暂无更多---'
          });
        }
      } else {
        that.setData({
          hidden: false,
          logingText: '---暂无更多---'
        })
      }



    }).catch(err => {
         // 具体参考 reject()
         if(err=='session已更新'){
          this.getListFn() //重新调用该函数
  
        }else{
          that.setData({
            logingText: err
          });
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
    })

  },

  navTo(e){
    var id = e.currentTarget.dataset.id

    // 在test页面就把name保存本地了，所以这里不需要再保存了



    wx.setStorageSync('xiaofang_link_str', `../answer-test-notime/answer-test-notime?id=${id}`) //为了在结果页面的再试一次功能

    wx.navigateTo({
      url: `../../answer-swiper-file/answer-test-notime/answer-test-notime?id=${id}`
    })

  },
  // 如果是可以就跳页面
  isOpenTo(e) {
    var that = this
    
    if (wx.getStorageSync("types") == 1) {
      // wx.navigateTo({
      //   url: '../subjcet/subjcet?id=' + e.currentTarget.dataset.id,
      // })
    }else{
      if (that.data.vip == 1) {
        that.setData({
          isTrue: false
        })
        // wx.navigateTo({
        //   url: '../subjcet/subjcet?id=' + e.currentTarget.dataset.id,
        // })
      } else {
        that.setData({
          isTrue: true
        })
      }
    }
  },
  // 关闭弹出层
  closeToast(){
    this.setData({
      isTrue: false
    })
  },

  editOpenidFn2() {
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: res => {
        var code = res.code
        wx.request({
          url: api + '/api/wxchat/updateCustomerOpenid',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': wx.getStorageSync('appid')
          },
          data: {
            code: code
          },
          method: "POST",
          success: (res) => {
            if (res.data.code == 1) {
              this.createOrdersFn()
            } else {
              wx.hideLoading()
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          },
        })

      },
      fail:res=>{
        wx.hideLoading()
      }
    })
  },
  // 创建订单，购买单个分类
  createOrdersFn() {
    var that = this
    wx.request({
      url: api + '/api/orders/createOrderFromList',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': wx.getStorageSync('appid')
      },
      data: {
        category_id: that.data.threeActive,
        type: 2
      },
      method: "POST",
      success: (res) => {
        if (res.data.code == 1) {
          that.playFn()
        } else {
       
          if (res.data.msg == '未登录' && wx.getStorageSync('appid')) {
            if (!wx.getStorageSync('phone')) {
              wx.removeStorage({
                key: 'appid'
              })
              return
            }
            this.ReLoginsesionFn()
            return
          }
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          wx.navigateTo({
            url: '../login/login',
          })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    })
  },

  ReLoginsesionFn() {
    var that = this
    wx.request({
      url: api + '/api/Customers/updatSessionId',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        phone: wx.getStorageSync('phone')
      },
      success: (res) => {
        if (res.data.code == 1) {
          wx.setStorage({
            key: "appid",
            data: 'PHPSESSID=' + res.data.data
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: "服务器错误",
          icon: 'none'
        })
      }
    })
  },
  // 微信支付
  playFn() {
    var that = this
    wx.request({
      url: api + '/api/wxchat/order_dopay',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': wx.getStorageSync('appid')
      },
      method: "POST",
      success: (res) => {
        wx.hideLoading()
        if (res.data.code == 1) {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success(res) {

              // wx.request({
              //   url: api + '/api/Wxchat/getWxPush',
              //   header: {
              //     'content-type': 'application/x-www-form-urlencoded',
              //     'cookie': wx.getStorageSync('header')
              //   },
              //   data: {
              //     type: 4,
              //     formid: that.data.formId,
              //   },
              //   success: (res) => { }
              // })
              // setTimeout(() => {
              //   wx.navigateBack({})
              // }, 1000)

            that.setData({
              page:1,
              isTrue:false
            })
              that.  getListFn()
              wx.showToast({
                title: '支付成功',
                icon: 'none'
              })
            },
            fail(res) { }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})