// pages/subjcet/subjcet.js
const app = getApp()
Page({
  data: {
    windowWidth: '',
    hidden: false,
    id: '', //从上个页面传过来的id
    topicData: [], //题目数据

    url: app.globalData.url,
    ispopup: false, //是否显示弹出层，默认false关闭
    current: 0, //当前页
    swiper_height: '90vh',

    name_map_str: '',

  },
  bindanimationfinish(e) {
    this.setData({
      current: e.detail.current,

    });
  },
  tapItemTopic(e) {
    // 跳转某一题




    this.setData({
      current: e.currentTarget.dataset.index,
      ispopup: false
    });
  },




  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var name_map_str = 'xiaofang_read' + options.id //拼接起来
    var that = this
    that.data.id = options.id
    that.data.name_map_str = name_map_str
    that.getListFn().then(res => {
      // 判断存在
      if (wx.getStorageSync(that.data.name_map_str)) {
        var current = wx.getStorageSync(that.data.name_map_str)
        wx.showModal({
          title: '提示',
          content: '是否继续阅读',
          success(res) {
            if (res.confirm) {
              that.setData({
                current: current
              })
            } else if (res.cancel) {
              wx.removeStorageSync(that.data.name_map_str)
            }
          }
        })
      }
      wx.hideLoading()
    })



  },

  togglePopup() {
    this.setData({
      ispopup: !this.data.ispopup
    });
  },
  // 数据
  getListFn() {
    var that = this
    return new Promise((resolve, reject) => {
      var param = {
        url: '/api/lessons/detail',
        data: {
          lesson_id: that.data.id
        }
      }
      app.http(param).then((res) => {
        var data = res.data.data
        that.setData({
          topicData: data,
        })
        resolve()

      }).catch(err => {
        // 具体参考 reject()
        if (err == 'session已更新') {
          this.getListFn() //重新调用该函数

        } else {
          wx.hideLoading()

          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
    })

  },

  forbidMove(e) {

    return;
  }, //禁止滑动
  navNextFn() {
    //下一题
    var that = this
    if (that.data.current + 1 >= that.data.topicData.length) {
      return
    }
    that.setData({
      current: that.data.current + 1,
      shoucanId: '', //每次把收藏id清空 
    })
  },
  navPreFn() {
    //上一题
    var that = this
    if (that.data.current > 0) {
      that.setData({
        current: that.data.current - 1
      })
    }
  },

  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this.data //这里注意下
    if (that.topicData.length != 0) {
      wx.setStorageSync(that.name_map_str, that.current)
    }
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
  onReady() {

  }

})