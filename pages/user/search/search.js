// pages/class-manage/class-manage.js
const app = getApp()
const api = app.globalData.api
Page({
  data: {

    translateX: 'translateX(0%)',
    page: 1,
    hidden: false,

    api: app.globalData.api,
    currentIndex: 0,
    isUpdata: false,//只有在初始化传来参数时才用到
    navList: [{

      state: 1, //根据后台接口决定修改的
      type: 5, //根据后台修改的
      text: '章节练习',
      logingText: '',
      subList: [],
      reload: true,
      init: true, //第一次的时候
      page: 1
    },
    {
      state: 1, //根据后台接口决定修改的
      type: 1, //根据后台修改的
      text: '模拟测试',
      logingText: '加载中...',
      subList: [],
      reload: true,
      init: true, //第一次的时候
      page: 1
    },
    {
      state: 2, //根据后台接口决定修改的
      type: 1,
      text: '班级排行',
      logingText: '加载中...',
      subList: [],
      reload: true,
      init: true, //第一次的时候
      page: 1
    },
    {
      state: 2, //根据后台接口决定修改的
      type: 2,
      text: '总排行',
      logingText: '加载中...',
      subList: [],
      reload: true,
      init: true, //第一次的时候
      page: 1
    }
    ],



  },
  // 监听下拉
  onReachBottom: function () {

    this.getListFn()
  },
  getListFn(e) {
    var that = this
    var source = ''

    if (that.data.isUpdata) { //只有上个页面传递参数才用到一次，后isUpdata变为false
      var a = that.data.currentIndex  //当前屏数
      that.setData({
        currentIndex: a,
        translateX: `translateX(${a}00%)`,
        isUpdata: false//变了一次就新了，不然不对了
      })
    }
    if (e) {
      // 说明是点击了tab
      source = 'tabChange'
      var current = e.currentTarget.dataset.index
      if (current == that.data.isflag) return
      that.data.currentIndex = current
      that.setData({
        currentIndex: current,
        translateX: `translateX(${current}00%)`
      })

      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    }
    var index = that.data.currentIndex;
    var navItem = that.data.navList[index];

    var type = navItem.type //根据后台传的
    var state = navItem.state //根据后台传的


    if (!navItem.reload || (!navItem.init && source)) return //不是第一次而且没有数据了就请求

    var param = {
      url: '',

      data: {
        type: type,
        page: navItem.page,
      }

    }


    if (state == 1) {
      param.url = '/api/customers/getHistoryScores'

    } else if (state == 2) {
      // 2说明调用该接口
      param.url = '/api/customers/rankList2'
    }

    var changelogingText = "navList[" + index + "].logingText";
    app.http(param).then((res) => {

      var data = res.data.data

      // console.log(data);

      navItem.init = false
      if (data.data.length == 0) {
        navItem.reload = false
        navItem.logingText = "---暂无更多---"


        this.setData({
          [changelogingText]: navItem.logingText,
        })
      } else {



        if(that.data.currentIndex==1){
          // 处理时间
          data.data.map(v=>{
            v.times=   Math.ceil( v.times)
          })
        }
        navItem.subList.push(...data.data)
        // console.log(navItem.subList);

        var changePage = "navList[" + index + "].page";

        var changeSub = "navList[" + index + "].subList";



        if (navItem.page >= res.data.data.last_page) {
          navItem.logingText = "---暂无更多---"
          navItem.reload = false

        } else {

          navItem.page += 1
          navItem.logingText = '加载中...'
        }

        this.setData({
          [changePage]: navItem.page + 1, //中括号括起来，不然无效
          [changeSub]: navItem.subList,
          [changelogingText]: navItem.logingText,
        })

      }

      // console.log(res);

      // console.log( navItem.logingText);

    }).catch(err => {
      // code不等于1并且sessionid和phone都不存在的情况下，不包括fail

      if (err == 'session已更新') {
        this.getListFn(e) //重新调用该函数

      } else {
        this.setData({
          [changelogingText]: err,
        })
      }


    })

  },
  onLoad: function (option) {

    if (option.currentIndex) {
      this.setData({
        currentIndex: option.currentIndex,
        isUpdata: true, //在改变了currentIndex就得true,不然transfrom不生效
      })
    }


    this.getListFn()
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