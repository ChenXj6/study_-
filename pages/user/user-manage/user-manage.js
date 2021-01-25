// pages/class-manage/class-manage.js
const app = getApp()
const api = app.globalData.api
Page({
  data: {
    date: '2019-12-20',
    date1: '',
    page: 1,
    hidden: false,
    logingText: '加载中...',
    api: app.globalData.api,
    listData: [],
  },
  // 监听下拉
  onReachBottom: function () {
    var that = this
    if (that.data.hidden == false) {
      return;
    }
    that.data.page++
    that.getListFn()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    this.setData({
      cust_id: options.cust_id
    })
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    this.setData({
      date1: year + "-" + month + "-" + day,
    })
    that.getListFn()
  },
  onShow: function () {

  },
  // 开始日期
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    this.getListFn(e.detail.value, 0)
  },
  // 结束日期
  bindDateChange1: function (e) {

    this.setData({
      date1: e.detail.value
    })
    this.getListFn(e.detail.value, 1)
  },
  getListFn(e, num) {
    var that = this
    if (num == 0) {
      that.setData({
        date: e
      })
    } else if (num == 1) {
      that.setData({
        date1: e
      })
    }












    var param = {
      url: '/api/Customers/getPersonManage',
      data: {
        page: that.data.page,
        cust_id: that.data.cust_id,
        start_date: that.data.date,
        end_date: that.data.date1,
      },
    }
    app.http(param).then((res) => {
      if (res.data.data.logList.length != 0) {
        that.setData({
          hidden: true,
          logingText: '---暂无更多---',
          listData: res.data.data.logList
        })
      } else {
        that.setData({
          hidden: false,
          listData: [],
          logingText: '---暂无更多---'
        })
      }


    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.getListFn(e, num) //重新调用该函数

      } else {

        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})