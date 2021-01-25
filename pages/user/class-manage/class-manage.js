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
    id:'',
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
  getListFn(e) {
    var that = this
    if(!that.data.data&&!e){
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
      data = year + "-" + month + "-" + day
    }
    if(e){
      var data =e
    }else{
      var data = that.data.data || data
    }
    var param = {
      url: '/api/Customers/classesManage',
      data: {
        page: that.data.page,
        date:data,
        classes_id:that.data.id,
      },
    }
    app.http(param).then((res) => {

        if (res.data.data.data.length != 0) {
          res.data.data.data.map(v=>{
            if (!v.curriculumn_log &&! v.realOperation &&! v.simulationTest &&! v.trueSubject && !v.video_log){
              v.istext=1
            }else{
              v.istext = 0
            }
          })
       
          that.setData({
            hidden: true,
            logingText: '加载中...'
          })
          if (that.data.page == 1) {
            that.setData({
              listData: res.data.data.data,
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
        this.getListFn(e) //重新调用该函数

      }else{
        that.setData({
          hidden: false,
          listData: [],
          logingText: err
        })
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })

  },
  onLoad: function (option) {
      this.data.id=option.id
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
        date: year + "-" + month + "-" + day
      })
      this.getListFn()
  },
  onShow: function () {

  },
  // 日期
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)

    this.getListFn(e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 查看个人信息
  lookUs(e) {
    var cust_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../user-manage/user-manage?cust_id=' + cust_id,
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