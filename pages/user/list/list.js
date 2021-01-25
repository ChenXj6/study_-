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
    listData: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    var that = this

    that.getListFn()


  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 班级列表
  getListFn() {
    var that = this
    var param = {
      url: '/api/customers/classesList',


    }
    app.http(param).then((res) => {

      console.log(res);
      var data = res.data.data

      if (res.data.data.length != 0) {
        that.setData({
          listData: data
        });
        console.log(res.data.data);
        
      }
      that.setData({
 
        logingText: '---暂无更多---'
      })
    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.getListFn() //重新调用该函数
      } else {
        this.setData({
          logingText: err,
        })
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },
  navTo(e) {

    var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../class-manage/class-manage?id=${id}`,
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})