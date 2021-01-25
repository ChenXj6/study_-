// pages/answer-swiper-file/answer-result/answer-result.js
const app = getApp()
const api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    total_score: '', //总分
    score: '', //得分
    category_id: '', //上个页面的id
    paperId: '', //试卷
    more: {},
    one: {},
    is: {},
    amount: {},
    name: '',
    idsData: {}, //数据
    typename: '', //是哪个传过来的

  },


  navTo(e){

    var name = e.currentTarget.dataset.name
 var xiaofang_id=   wx.getStorageSync('xiaofang_id')
    var paperId=this.data.paperId

    wx.setStorageSync('xiaofang_name', name) //把name保存到本地，别的地方会用到
    if(name=='错题练习专区'){
        // 是错题按钮的
        wx.navigateTo({
          url: `../error-test-notime/error-test-notime?id=${xiaofang_id}&issave=${false}`
        })
    }else  if(name=='错题答案'){
      wx.navigateTo({
        url: `../errorData/errorData?id=${xiaofang_id}&issave=${false}`
      })
    } else{
      wx.navigateTo({
        url: `../answer-test-notime/answer-test-notime?id=${paperId}&issave=${false}&ismethod=3`
      })
    }
   

  },

  openBack() {
        /**
     * @ wx.setStorageSync('xiaofang_link_str', '') //为了在结果页面的再试一次功能
     * 章节练习、历年真题、随机小练、理论模拟考试这4个用到
     * */ 
    var link= wx.getStorageSync('xiaofang_link_str')
    wx.redirectTo({
      url: link,
    })
  },
  openMoniResult() {
    wx.navigateTo({
      url: '../moni-record/moni-record?id=' + this.data.category_id,
    })
  },
  openNavack() {
    // 放回章节
    wx.navigateBack({


    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var that = this
    that.ansHistoryFn(options.paperId, options.idsData)
    that.setData({
      typename: options.typename,
      category_id: options.category_id,
      paperId: options.paperId,
      idsData: options.idsData,
    })

  },
  ansHistoryFn(paperId, idsData) {
    var that = this


    var param = {
      url: '/api/answers/storeAnswerRecord',
      data: {
        paperId: paperId,
        idsData: idsData
      },
    }
    app.http(param).then((res) => {



      var data = res.data.data.scoreLog
      wx.hideLoading()
      that.setData({
        amount: data.amount,
        more: data.more,
        is: data.is,
        one: data.one,
        total_score: res.data.data.total_score,
        score: res.data.data.score,
        name: res.data.data.typeName
      })

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.ansHistoryFn(paperId, idsData) //重新调用该函数

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