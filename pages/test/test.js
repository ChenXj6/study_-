// pages/cook-item/cook-item.js
//获取应用实例
const app = getApp()
const api = app.globalData.api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    api: app.globalData.api,
    url: app.globalData.url,

    data: {},
    name: '',
    code:1, //是否暂无考试。或报错,


  },
  handleContact (e) {
    // console.log(e.detail.path)
    // console.log(e.detail.query)
},
  onShow() {

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('xiaofang_user_name'), //页面标题
    })

    this.getFn()
  },


  getFn() {
    var that = this
    var param = {
      url: '/api/subjects/getCategoryTime',
    }
    app.http(param).then((res) => {
  



      that.setData({

        data: res.data.data,
        name: wx.getStorageSync('xiaofang_user_name'),
        code:1,
      })

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.getFn() //重新调用该函数

      } else {

        that.setData({
          code:0,
 
        })
       if(err=='暂无考试'){
         return
       } 



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



  navTo2() {
    // 实操章节

    if(this.data.code==0){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }




    var xiaofang_id = wx.getStorageSync('xiaofang_id')
    wx.navigateTo({
      url: `../answer-swiper-file/sc-moni/sc-moni?id=${xiaofang_id}`
    })

  },
  navTo3() {
    if(this.data.code==0){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    // 排行榜
    wx.navigateTo({
      url: '../user/search/search?currentIndex=2'  //直接跳到班级排行的地方,即下标为2的地方
    })
  },

  navTo(e) {
    /**
    @param 
    *name  //是什么，来决定调用哪个接口  存储到本地了
    *isrouter //判断是跳转哪个，1代表answer-test,2answer-test-notime,3error-test-notime
    *issave //退出是否保存到本地   //issave=true //和错题练习专区、全部答案、错题答案
    *ismethod //用哪种模式  //ismethod=1

    */
    /**
     * @ wx.setStorageSync('xiaofang_link_str', '') //为了在结果页面的再试一次功能
     * 章节练习、历年真题、随机小练、理论模拟考试这4个用到
     * */ 

    if(this.data.code==0){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }



    if (wx.getStorageSync('xiaofang_has_class') == 1) {
      // 说明有班级
      var isrouter = e.currentTarget.dataset.isrouter
      var name = e.currentTarget.dataset.name
      wx.setStorageSync('xiaofang_name', name) //把name保存到本地，别的地方会用到
      var xiaofang_id = wx.getStorageSync('xiaofang_id')

      if (isrouter == 1) { //使用answer-test
        // 保存时间的

        if (name == '理论模拟考试') {
          wx.setStorageSync('xiaofang_link_str',  `../answer-test/answer-test?id=${xiaofang_id}&ismethod=2`) //为了在结果页面的再试一次功能
          wx.navigateTo({
            url: `../answer-swiper-file/answer-test/answer-test?id=${xiaofang_id}&ismethod=2`
          })
        }
      } else if (isrouter == 2) {
        // 不保存时间的
        if (name != '理论模拟考试') {
          if (name == '章节练习') {
            // 历年和章节有列表

            wx.navigateTo({
              url: './list/list?id=' + xiaofang_id
            })

          } 

          else if (name == '历年真题') { //后面几个在这个页面其实用不到，
            wx.navigateTo({
              url: `./years-list/years-list?id=${xiaofang_id}`
            })
          } 
          else if (name == '我的收藏') { //后面几个在这个页面其实用不到，
           
            // wx.navigateTo({
            //   url: `../answer-swiper-file/answer-test-notime/answer-test-notime?id=${xiaofang_id}&issave=${false}&isbtn=false`
            // })

            wx.navigateTo({
              url: `../answer-swiper-file/lianxi/lianxi?issave=${false}&isbtn=${false}`
            })


          } else {


            wx.setStorageSync('xiaofang_link_str', `../answer-test-notime/answer-test-notime?id=${xiaofang_id}`) //为了在结果页面的再试一次功能


            wx.navigateTo({
              url: `../answer-swiper-file/answer-test-notime/answer-test-notime?id=${xiaofang_id}`
            })
          }
        }

      } else if (isrouter == 3) {
        // 是错题按钮的
        wx.navigateTo({
          url: `../answer-swiper-file/error-test-notime/error-test-notime?id=${xiaofang_id}&issave=${false}`
        })

      }

    } else {


      wx.showModal({
        title: '提示',
        content: '同学，你还不属于任何一个班级',
        confirmText: '返回首页',
        cancelText: '关闭',
        success(res) {
          if (res.confirm) {



            wx.switchTab({
              url: '../index/index',
            })


          } else if (res.cancel) {

          }
        }
      })




    }








  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    that.data.subject_pid = 1


  },



})