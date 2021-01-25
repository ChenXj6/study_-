//app.js
App({


  http: require('/utils/http'),  //封装的接口
  onLaunch: function () {
    // wx.getSystemInfo({
    //   success(res) {
    //     if (res.platform == "android") {
    //       wx.setStorageSync('types', '0')
    //     } else if (res.platform == "ios") {
    //       wx.setStorageSync('types', '1')
    //     }
    //   }
    // })
    // if (wx.getStorageSync('xiaofang_session') && wx.getStorageSync('xiaofang_phone')) {
    //   wx.request({
    //     url: this.globalData.api + '/api/Customers/updatSessionId',
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded',
    //     },
    //     data: {
    //       phone: wx.getStorageSync('xiaofang_phone')
    //     },
    //     method: 'POST',
    //     success: (res) => {
    //       if (res.data.code == 1) {
    //         wx.setStorageSync('xiaofang_session', 'PHPSESSID=' + res.data.data)
    //       }
    //     },
    //   })
    // } 

    // https://www.jianshu.com/p/3d6c3c80813f  //微信授权登录
  },

  
/**
 * xiaofan_id
 * 用户选择了哪个分类对应的id
 * */  
  globalData: {
    userInfo: null,
    api:'https://fire3.pzhkj.cn/', //最新的,改动http.js也需要更新
    // api:"https://fire-edu.pzhkj.cn/",
    url:'https://fire-edu.oss-cn-beijing.aliyuncs.com',
    img:'/image/photo.png', //默认头像
  }
})
