const app = getApp()
const api = app.globalData.api
// var WxParse = require('../../wxParse/wxParse.js');
var time = require("../../../utils/util.js").default.getTimes
var towxml = require('../../../towxml/index.js') // 引入`towxml3.0`解析方法

Page({
  data: {

    page: 1,
    hidden: false,
    img: app.globalData.img,
    api: app.globalData.api,
    price: '', //价格
    title: '', // 文章title

    id: '',
    article: {}, // 内容数据
    isLoading: true, // 判断是否尚在加载中
    isLoadingTexts: '文章努力加载中',
    articleData: '', //文章内容
    isshow:1, //is_show=1代表隐藏，0代表显示
  },
  // 监听
  onReachBottom: function () {

  },
  onLoad: function (options) {
    const that = this
    that.isshowFn()
    that.getDetailFn(options.id)

    // 保存变量
    that.data.id = options.id

  },

  onShow: function () {},
  // isPopupFn(){
  //   this.setData({
  //     isPopup: !this.data.isPopup
  //   })
  // },

  isshowFn() {
    var that = this
    var param = {
      url: '/api/index/getConfig',
    }
    app.http(param).then((res) => {
      console.log(res);
      var data = res.data.data.is_show



      that.setData({
        isshow: data,
      });
    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.isshowFn() //重新调用该函数

      } else {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }

    })

  },
  getDetailFn(id) {
    var that = this
    var param = {
      url: '/api/Index_categories/detail',
      data: {
        category_id: id
      },
    }
    app.http(param).then((res) => {
      // console.log(res);
      var detail_content = res.data.data.content
      // WxParse.wxParse('detail_content', 'html', detail_content, that, 0);
      let result = towxml(detail_content, 'html', {
        base: 'https://fire-edu.pzhkj.cn', // 相对资源的base路径
        theme: 'light', // 主题，默认`light`
        events: { // 为元素绑定的事件方法
          tap: (e) => {
            var childs = e.currentTarget.dataset.data.child
            childs.map(v => {
              if (v.tag == 'img') {
                wx.previewImage({
                  current: v.attr.src, // 当前显示图片的http链接
                  urls: [v.attr.src] // 需要预览的图片http链接列表
                })
              }
            })
          }
        }
      });
      that.setData({
        title: res.data.data.name,
        article: result,
        articleData: detail_content, //
        price: res.data.data.price, //价格
        isLoadingTexts: '---暂无更多---',
      });

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.getDetailFn(id) //重新调用该函数

      } else {


        that.setData({
          isLoadingTexts: err,
        });


     
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },


  getOpenidFn(code) {
    var that = this
    var param = {
      url: '/api/wxchat/updateCustomerOpenid',
      data: {
        code: code
      }
    }
    app.http(param).then((res) => {
      this.createOrderFn()
    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.getOpenidFn(code) //重新调用该函数

      } else {




        wx.hideLoading()
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },
  wxLogin() {
    /**
     * 支付流程
     * 1先微信授权那code发给后台，目的获取openid // wx.login() 、getOpenidFn(code)
     * 2创建订单createOrderFn
     * 3支付goPay
     * */
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: res => {
        var code = res.code
        this.getOpenidFn(code)
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: JSON.stringify(err),
          icon: 'none'
        })
      }
    })
  },



  createOrderFn() {
    // 创建订单
    var that = this
    var param = {
      url: '/api/orders/purchaseLesson',
      data: {
        category_id: that.data.id
      }
    }
    app.http(param).then((res) => {

      that.goPay()


    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.createOrderFn() //重新调用该函数

      } else {
        wx.hideLoading()
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })


  },
  goPay() {
    // 购买
    var param = {
      url: '/api/wxchat/order_dopay',
    }
    app.http(param).then((res) => {
      wx.hideLoading()
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: res.data.data.package,
        signType: res.data.data.signType,
        paySign: res.data.data.paySign,
        success(res) {

          wx.showToast({
            title: '支付成功',
            icon: 'none'
          })

          setTimeout(() => {
            wx.switchTab({
              url: '../index',
            })

          }, 250)


        },
        fail(error) {
          wx.showToast({
            title: JSON.stringify(error),
            icon: 'none'
          })


        }
      })

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.goPay() //重新调用该函数

      } else {
        wx.hideLoading()
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})