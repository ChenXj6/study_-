const app = getApp()
const api = app.globalData.api
Page({
  data: {
    page: 1,
    hidden: false,
    logingText: '加载中...',
    url: app.globalData.url, //图片路径
    listData: [],
    id: '', //分类ID

    activeNames: ['1'], //插件中的

    type: '', //类型
    detail_id: '',
    index: 0, //点击的下标
    saveArr_id: [],
  },
  onLoad: function (options) {
    const that = this

    that.setData({
      id: options.id,
      type: options.type,
    })
    that.getListFn("onLoad")
  },
  onShow() {

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

  // 获取详情
  getDetailFn(source) {
    var index = this.data.index
    var navItem = this.data.listData[index]
    if (navItem.isclick == false) {
      return
    }
    navItem.isclick = false
    if (navItem.isload == false) {
      return
    } else {
      var changelogingText = "listData[" + index + "].logingText";
      this.setData({
        [changelogingText]: '加载中...',
      })
    }
    var param = {
      url: '/api/curriculums/getCurriculumListNew',
      data: {
        page: navItem.page,
        category_id: this.data.detail_id,
        type: this.data.type,
      },
    }
    app.http(param).then((res) => {



      if (res.data.data.data.length == 0 && source == 'addEventFn') {
        navItem.logingText = '该分类下暂无内容'
      } else {
        navItem.logingText = ''
      }
      if (navItem.page >= res.data.data.last_page) {

        navItem.isload = false

      } else {
        navItem.isload = true
      }
      navItem.onload = false
      navItem.list.push(...res.data.data.data)

      var changeisclick = "listData[" + index + "].isclick";

      var changePage = "listData[" + index + "].page";
      var changeSub = "listData[" + index + "].list";
      var changeLoad = "listData[" + index + "].isload";
      var changeisshowbtn = "listData[" + index + "].isshowbtn";
      var changelogingText = "listData[" + index + "].logingText";


      var changeonload = "listData[" + index + "].onload";
      this.setData({
        [changeLoad]: navItem.isload,
        [changeonload]: false,
        [changePage]: navItem.page + 1, //中括号括起来，不然无效
        [changeSub]: navItem.list,
        [changelogingText]: navItem.logingText,
        [changeisclick]: true,
        [changeisshowbtn]: navItem.isload,

      })
    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.getDetailFn() //重新调用该函数

      } else {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }

    })
  },
  // 获取列表
  getListFn(source) {
    var that = this
    var param = {
      url: '/api/curriculums/getCurriculumChildCategoryNew',
      data: {
        page: that.data.page,
        category_id: that.data.id,
      },
    }
    app.http(param).then((res) => {
      res.data.data.data.map(v => {

        v.logingText = ""
        v.list = []
        v.isload = true //是否可以加载
        v.page = 1,
          v.isshowbtn = false //是否出现点击加载更多按钮
        v.onload = true //是否为第一次加载
        v.isclick = true //防止重复点击
      })



      if (res.data.data.data.length != 0) {
        that.setData({
          hidden: true,
          logingText: '加载中...',
          activeNames: [res.data.data.data[0].id],
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
            hidden: false,
            logingText: '---暂无更多---'
          });
        }

        if (source == 'onLoad') {

          that.setData({
            detail_id: res.data.data.data[0].id
          });
          that.getDetailFn()
        }
      } else {
        that.setData({
          hidden: false,
          logingText: '---暂无更多---'
        })
      }

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.getListFn(source) //重新调用该函数

      } else {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },
  // 点击加载更多
  tapMoreFn(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    this.data.index = index

    this.getDetailFn()
  },
  openVipFn() {
    wx.navigateTo({
      url: '../member/member',
    })
  },
  // 插件中的
  onChange(event) {

    var saveArr_id = this.data.saveArr_id
    var newArr = event.detail
    var index
    this.setData({
      activeNames: newArr
    });
    var _id
    if (saveArr_id.length < newArr.length) {
      _id = newArr[newArr.length - 1]
    } else {
      return
    }

    this.data.listData.forEach((v, i) => {
      if (v.id == _id) {
        index = i
      }
    })
    this.data.detail_id =_id
    this.setData({
      index: index
    })
    var navItem = this.data.listData[index]
    console.log(navItem.onload);

    if (navItem.onload) {
      // 只有第一次才出发，不然是用按钮点击出发的
      this.getDetailFn('addEventFn')
    }















    console.log(index);



  },
  // 页面跳转
  goDetail(e) {

    var id = e.currentTarget.dataset.id
    // if(wx.getStorageSync('xiaofang_has_class')!=1){
    //   // 不是会员的时候
    //   if(isfree==0){

    //     wx.showToast({
    //       title: '同学,你还不属于任何一个班级',
    //       icon: 'none'
    //     })
    //     return
    //   }

    // }

    var type = this.data.type
    if (type == 3) {
      // 3是阅读
      wx.navigateTo({
        url: `../read/read?id=${id}&index=${type}`,
      })
    } else {
      // 0和1是视频和音频

      wx.navigateTo({
        url: `../video-detail/video-detail?id=${id}&index=${type}`,
      })

    }











    // var that = this
    // if (wx.getStorageSync("types") == 1) {
    //   wx.navigateTo({
    //     url: '../video-detail/video-detail?article_id=' + e.currentTarget.dataset.id + '&type=2',
    //   })
    // } else {
    //   if (e.currentTarget.dataset.isfree == 1 || that.data.vip == 1) {
    //     wx.navigateTo({
    //       url: '../video-detail/video-detail?article_id=' + e.currentTarget.dataset.id + '&type=2',
    //     })
    //   } else {
    //     that.setData({
    //       isTrue: true
    //     })
    //   }
    // }


  },


})