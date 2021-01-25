// pages/answer-swiper-file/sc-moni-result/sc-moni-result.js
const app = getApp()
const api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paperId: '',//试卷
    data:[],
    total_score:'',
    score: '',
    name: '',
  },
  openBack() {
    wx.redirectTo({
      url: '../answer-swiper-file/sc-moni/sc-moni?id=' + this.data.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    var that = this
    this.setData({
      paperId: options.paperId
    })        
    that.getListFn()
  },
  getListFn() {
    var that = this
    wx.request({
      url: api + '/api/answers/getRelOperationSimulationResult',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': wx.getStorageSync('appid')
      },
      data: {
        paperId: that.data.paperId,
      },
      success: (res) => {
        if (res.data.code == 1) {
          wx.hideLoading()
          that.setData({
            data: res.data.data.log,
            total_score: res.data.data.total_score,
            score: res.data.data.score,
            name: res.data.data.typeName
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