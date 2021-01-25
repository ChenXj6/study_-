// pages/class/class/class.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    code:1,
    isshow:1, //is_show=1代表隐藏，0代表显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.isshowFn()
  },
  tapImage(){
    if(this.data.code==0){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
  },
  navTo(e) {
    if(this.data.code==0){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    // 类型 1=视频 2=音频 3=阅读	
    var type = e.currentTarget.dataset.type //跳哪个页面
    var index = e.currentTarget.dataset.index //  0、1、2
    var id = e.currentTarget.dataset.id //  0、1、2
    wx.navigateTo({
      url: `./list/list?index=${index}&type=${type}&id=${id}`
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

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('xiaofang_user_name'), //页面标题
    })


    this.getData()










  },
  getData() {
    var that = this
    var param = {
      url: '/api/subjects/getSubjectChildCategory1',
    }
    app.http(param).then((res) => {
      console.log(res);
      var data = res.data.data



      that.setData({
        data: data,
        code:1
      });



    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.getData() //重新调用该函数

      } else {
        
      that.setData({
        code: 0,
      });

      console.log(err);
      
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