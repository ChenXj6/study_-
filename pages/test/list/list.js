// pages/cook-item-sub/cook-item-sub.js
const app = getApp()
const api = app.globalData.api
Page({
  /**
   * 页面的初始数据
   */
  data: {

    isshow: true,


    currentIndex: 0,
    navList: [{
        type: 1, //根据后台修改的
        info: {},
        logingText: '',
        subList: [],
        reload: true,
        init: true, //第一次的时候
        page: 1
      },
      {

        type: 2, //根据后台修改的
        info: {},
        logingText: '加载中...',
        subList: [],
        reload: true,
        init: true, //第一次的时候
        page: 1
      }
    ],

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getListFn()

    this.titleFn()
  },

  // 监听下拉
  onReachBottom: function () {

    this.getListFn()
  },

  navTo(e){
    var id = e.currentTarget.dataset.id

    // 在test页面就把name保存本地了，所以这里不需要再保存了


    wx.setStorageSync('xiaofang_link_str', `../answer-test-notime/answer-test-notime?id=${id}`) //为了在结果页面的再试一次功能
    wx.navigateTo({
      url: `../../answer-swiper-file/answer-test-notime/answer-test-notime?id=${id}`
    })
  },
  titleFn(){
    var param = {
      url: '/api/subjects/getSubjectChildCategory1',

    }
    app.http(param).then((res) => {
      var data = res.data.data
      var changetext0 = "navList[" + 0 + "].info";
      var changetext1 = "navList[" + 1 + "].info";
      this.setData({
        // [changelogingText]: navItem.logingText,
        [changetext0]: data[0],
        [changetext1]: data[1],
      })
    }).catch(err => {
  
      if (err == 'session已更新') {
        this.titleFn() //重新调用该函数

      } else {

      }








    })




















  },
  getListFn(e) {
    var that = this
    var source = ''
    if (e) {
      // 说明是点击了tab
      source = 'tabChange'
      var current = e.currentTarget.dataset.index
      if (current == that.data.isflag) return
      that.data.currentIndex = current
      that.setData({
        currentIndex: current,

      })

      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    }
    var index = that.data.currentIndex;
    var navItem = that.data.navList[index];

    var type = navItem.type //根据后台传的



    if (!navItem.reload || (!navItem.init && source)) return //不是第一次而且没有数据了就请求

    var param = {
      url: '/api/subjects/getSubjectChildCategory2',

      data: {
        type: type,
        page: navItem.page,
      }

    }



    var changelogingText = "navList[" + index + "].logingText";
    app.http(param).then((res) => {
      var data = res.data.data
      navItem.init = false
      if (data.length == 0) {
        navItem.reload = false
        navItem.logingText = "---暂无更多---"
      } else {


        navItem.subList.push(...data)



        console.log(navItem.subList);

        // var changePage = "navList[" + index + "].page";
        
        var changeSub = "navList[" + index + "].subList";
        navItem.logingText = "---暂无更多---"
        this.setData({
          [changeSub]: navItem.subList,
          [changelogingText]: navItem.logingText,
        })

      }

    

      // console.log( navItem.logingText);

    }).catch(err => {
  
      if (err == 'session已更新') {
        this.getListFn(e) //重新调用该函数

      } else {
        this.setData({
          [changelogingText]: err,
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})