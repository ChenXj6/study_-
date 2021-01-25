// pages/class-manage/class-manage.js
const app = getApp()
const api = app.globalData.api
Page({
  data: {
    date: '',
    page: 1,
    hidden: false,
    logingText: '加载中...',
    api: app.globalData.api,
    listData: [],
    category_id:''
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
  getListFn() {
    var that=this
    var param = {
      url: '/api/customers/getTestScoreLog',
      data: {
        page: that.data.page,
        category_id:that.data.category_id
      },
    }
    app.http(param).then((res) => {
   
      if (res.data.data.data.length != 0) {
        that.setData({
          hidden: true,
          logingText: '加载中...'
        })
        if (that.data.page == 1) {
          that.setData({
            listData: res.data.data.data,
            logingText: '上拉加载更多'

          });
        } else {
          var list = that.data.listData;
          that.setData({
            listData: list.concat(res.data.data.data),
          });
        }
        if (that.data.page >= res.data.data.last_page) {
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
            logingText:err
          });
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
    })

  },
  onLoad: function (options) {
    var that=this
    that.setData({
      category_id: options.id,
    })
    that.getListFn()

  },
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