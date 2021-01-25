//获取应用实例
const app = getApp()
const api = app.globalData.api

Page({
  data: {
    code: '1', //判断是否登录成功
    username: '',
    userimg: '',
    list: [{
        title: '班级管理',
        img: '../../image/user-1.png'
      },
      {
        title: '成绩查询',
        img: '../../image/user-3.png'

      },
      // {
      //   title: '推荐奖励说明',
      //   img: '../../image/user-5.png'

      // }, {
      //   title: '关于我们',
      //   img: '../../image/user-6.png'

      // },
    ]
  },
  onLoad: function (options) {

  },
  onShareAppMessage(e) {
    return {
      title: '国泰消安',
      path: '/pages/index/index', // 好友点击分享之后跳转到的小程序的页面
      // desc: '描述', // 看你需要不需要，不需要不加
      imageUrl: '/img/logo.png'
    }
  },

  tapClearFn() {
    setTimeout(() => {
      wx.showToast({
        title: '清除成功',
        icon: 'none'
      })
    }, 700)
  },
  onShow: function () {

    this.getListFn()
  },
  // 跳转方法
  navUrl(url) {
    wx.navigateTo({
      url: url,
    })
  },
  // 是否跳转到登录页面
  openLoginFn() {
    if (this.data.code == 0) {
      wx.navigateTo({
        url: "../login/login",
      })
    } else {
      wx: wx.navigateTo({
        url: './set/set',
      })
    }
  },
  // 用户数据
  getListFn() {
    var that = this

    var param = {
      url: '/api/Customers/getCustomerInfo',
    }
    app.http(param).then((res) => {
      this.setData({
        code: '1',
        username: res.data.data.nickname,
        userimg: res.data.data.avatar,
      });

      if (!res.data.data.nickname) {

        wx.showToast({
          title: '请填写姓名',
          icon: 'none',
        })

        setTimeout(() => {
          wx.navigateTo({
            url: './set/set',
          })
        }, 300)
      }
    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.getListFn() //重新调用该函数

      } else {
        this.setData({
          code: 0,
          username: '去登录'
        })
        
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

  //页面跳转
  goPage(e) {
    var that = this

    var title = e.currentTarget.dataset.title
    if (this.data.code == 0) {
      wx.navigateTo({
        url: "../login/login",
      })
      wx.showToast({
        title: "请先登录",
        icon: 'none'
      })
      return
    }


    switch (title) {
      // case '关于我们':  //改为跳客服中心了，这个不需要了
      case '班级管理':
        // that.navUrl("./class-manage/class-manage")
        that.navUrl("./list/list")
        break;

      case '成绩查询':
        that.navUrl('./search/search')
        break;

      case '推荐奖励说明':
        that.navUrl('./reward/reward')
        break;

      case '设置':
        that.navUrl('./set/set')
        break;
    }
  },

  // 退出登录
  outLoginFn() {
    var that = this


    if (that.data.code == 0) {

      wx.navigateTo({
        url: '../login/login',
      })

      return
    }




    var param = {
      url: '/api/Customers/logout',
    }
    app.http(param).then((res) => {
      wx.clearStorageSync()
      that.setData({
        userimg: '',
        username: '',
        code: 0
      })
      wx.navigateTo({
        url: '../login/login',
      })
    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.outLoginFn() //重新调用该函数

      } else {

        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })

  },
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

})