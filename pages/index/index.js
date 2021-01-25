//index.js
//获取应用实例
const app = getApp()
const api = app.globalData.api
var time = require("../../utils/util.js").default.getTimes
Page({
  data: {
    hidden: false,
    logingText: '---暂无更多---',
    api: app.globalData.api,

    url: app.globalData.url,
    ispopup: false, //是否显示弹出层

    categoryList: [], //头部的列表数据
    xiaofang_id: '', //选择的id,很重要，列：初级，中级，高级等 ,也有本地存储的，跟他名称一样
    has_class: '', //该用户是否有班级
    index: 0, //默认选的是第一个
    bannerList: [], //轮播



    test_score: '',
    video_length: '',


  },
  onPullDownRefresh: function () {
    this.categoryFn()
    this.getBanner()

    wx.stopPullDownRefresh() //停止下拉刷新
    setTimeout(() => {
      wx.showToast({
        title: '刷新成功',
        icon: 'none'
      })
    }, 500)
  },
  // 监听下拉
  onReachBottom: function () {

  },
  //事件处理函数
  navTo: function (e) {
    // e.currentTarget.dataset.id



    if (this.data.has_class == 1) {
      //说明是有班级的

      wx.switchTab({
        url: '../class/class',
      })
    } else {





      wx.navigateTo({
        url: './new-detail/new-detail?id=' + e.currentTarget.dataset.id
      })
    }


  },
  togglePop() {
    // 弹出层切换

    if (this.data.has_class == 1) return //说明是有班级的
    this.setData({
      ispopup: !this.data.ispopup
    })
  },

  onLoad: function () {



  },
  selectAnsFn(e) {
    // 选择某一个
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    wx.setStorageSync('xiaofang_id', id)
    this.setData({
      ispopup: false,
      index: index
    })
  },
  getBanner() {

    var param = {
      url: '/api/index/bannerList',

    }
    app.http(param).then((res) => {

      var data = res.data.data
      this.setData({
        bannerList: data,
      });

      // console.log(data);

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.getBanner() //重新调用该函数

      } else {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })









  },

  switchTo(e) {
    var num = e.currentTarget.dataset.num
    if (num == 0) {
      wx.switchTab({
        url: '../class/class',
      })
    } else if (num == 1) {
      wx.switchTab({
        url: '../test/test',
      })
    }
  },
  categoryFn() {

    var that = this
    var param = {
      url: '/api/Index_categories/index',
    }
    app.http(param).then((res) => {

      // console.log(res);
      var data = res.data.data
      that.setData({
        test_score: data.test_score,
        video_length: data.video_length,
        has_class: data.has_class, //0为每班级,1为有班级
        categoryList: data.list,
        xiaofang_id: data.list[0].id //默认是第一个的id
      });

      wx.setStorageSync('xiaofang_has_class', data.has_class) //把xiaofang_id保存起来，别的页面需要
      wx.setStorageSync('xiaofang_id', data.list[0].id) //把xiaofang_id保存起来，别的页面需要
      wx.setStorageSync('xiaofang_user_name', data.list[0].name) //

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.categoryFn() //重新调用该函数

      } else {
        if(err=="请先登录"){

          wx.showModal({
            title: '提示',
            content: '请先登录',
            confirmText:'去登录',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')

                wx.navigateTo({
                  url: '/pages/login/login',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      }
    })
  },
  onShow() {
    this.setData({
      index: 0
    })
    if (wx.getStorageSync('xiaofang_session') && wx.getStorageSync('xiaofang_phone')) {
      wx.request({
        url: this.data.api + '/api/Customers/updatSessionId',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {
          phone: wx.getStorageSync('xiaofang_phone')
        },
        method: 'POST',
        success: (res) => {
          if (res.data.code == 1) {
            wx.setStorageSync('xiaofang_session', 'PHPSESSID=' + res.data.data)

            this.categoryFn()
            this.getBanner()
          }
        },
      })
    } else {
      this.categoryFn()
      this.getBanner()
    }
  }
})