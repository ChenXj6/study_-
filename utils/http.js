module.exports = function http(options) {

  var api = 'https://fire3.pzhkj.cn' //最新的,改动http.js也需要更新
  var url = api + options.url;
  var method = options.method || "POST";
  var data = options.data || {};
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,

      method: method,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': wx.getStorageSync('xiaofang_session')
      },
      data: data,
      success(res) {
        if (res.data.code == 1) {
          resolve(res)
        } else if (res.data.code == 0 && res.data.msg == '未登录') { // 验证码失效后重新更新再次调用
          if (wx.getStorageSync('xiaofang_session') && wx.getStorageSync('xiaofang_phone')) {
            wx.request({
              url: api + '/api/Customers/updatSessionId',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              data: {
                phone: wx.getStorageSync('xiaofang_phone')
              },
              method: 'POST',
              success: (res) => {
                if (res.data.code == 1) {
                  wx.setStorageSync('xiaofang_session', 'PHPSESSID=' + res.data.data)

                  /**
                   * http(options)
                   * 会用这种写法,有个问题，调用了但页面的数据不会更新
                   * 
                   * 处理方式，给个返回值，在该页面进行调用一次
                   * reject("session已更新")
                   * */
                  reject("session已更新")
                }
              },
              fail: () => {
                wx.showToast({
                  title: "网络出错,请稍后重试",
                  icon: 'none'
                })
              }
            })
          } else {
            // wx.showToast({
            //   title: "请先登录",
            //   icon: 'none',
            // })
            reject('请先登录')
            // setTimeout(() => {

            //   wx.navigateTo({
            //     url: '/pages/login/login',
            //   })
            // }, 500)
          }
        } else {

          console.log(res ,'https');
          reject(res.data.msg)

        }
      },
      fail(err) {
        reject('网络出错,请稍后重试')
        wx.showToast({
          title: "网络出错,请稍后重试",
          icon: 'none'
        })
      }
    })
  })
}
