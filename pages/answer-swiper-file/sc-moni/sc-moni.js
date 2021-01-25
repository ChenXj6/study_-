// pages/answer-swiper-file/sc-moni/sc-moni.js
const app = getApp()
const api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    audioText: '按键回答',
    swiper_height: '85vh',
    id: '',
    current: 0, //当前轮播数
    list_length: '',
    tapFlag:false, //答题动画开关
    endTime: '',
    timer: '',
    windowWidth: '',
    hidden: false,
    logingText: '加载中...',
    data: '',
    id: '', //从上个页面传过来的id
    title: '',
    listData1: [],
    listData2: [],
    listData3: [],
    ans: '', //正确答案
    eng: '', //选择的答案
    isIndex: 0,
    paperId: '', //试卷id

  },

audioSubmit(){
  var that = this




  var param = {
    url: '/api/answers/storeRelOperationSimulation',
    data: {
      paperId: that.data.paperId,

    },
  }
  app.http(param).then((res) => {
 



    wx.redirectTo({
      url: '../answer-swiper-file/sc-moni-await/sc-moni-await',
    })








  }).catch(err => {
       // 具体参考 reject()
       if(err=='session已更新'){
        this.audioSubmit() //重新调用该函数

      }else{
       
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
  })


},
  // 单选
  selectAnsFn(e) {
    // 选择某个选项
    var that = this
    var userans = e.currentTarget.dataset.userans //用户答案
    var ans = e.currentTarget.dataset.ans //正确答案
    var eng = e.currentTarget.dataset.english //用户选择的答案
    var num = e.currentTarget.dataset.num //为1说明是单选题，所以是listData1
    var index = e.currentTarget.dataset.index //对应数组的下标
    if (num == 1) {
      that.data.listData1.list[index].userAns = eng //用户选择的答案
      if (ans == eng) {
        that.data.listData1.list[index].istip = false
        that.data.listData1.list[index].istrue = 1
      } else {
        that.data.listData1.list[index].istip = true
        that.data.listData1.list[index].istrue = 2
      }
      that.setData({
        listData1: that.data.listData1,
      })
    }
    that.setData({
      ans: e.currentTarget.dataset.ans,
      eng: e.currentTarget.dataset.english,
    })
  },
  // 判断题
  selectAnsFn3(e) {
    var that = this
    var eng = e.currentTarget.dataset.num //用户选择的答案
    var ans = e.currentTarget.dataset.ans //正确答案
    var index = e.currentTarget.dataset.index //对应数组的下标
    var userans = e.currentTarget.dataset.userans //用户答案
    that.data.listData3.list[index].isuser = '1' //用户是否答过
    that.data.listData3.list[index].userAns = eng //用户选择的答案
    if (ans == eng) {
      that.data.listData3.list[index].istip = false
      that.data.listData3.list[index].istrue = 1
    } else {
      that.data.listData3.list[index].istip = true
      that.data.listData3.list[index].istrue = 2

    }
    that.setData({
      listData3: that.data.listData3,
    })
    that.setData({
      ans: e.currentTarget.dataset.ans,
      eng: e.currentTarget.dataset.english,
    })
  },



  saveFn(obj){


    var that=this
    var param = {
      url: '/api/orders/purchaseLesson',
      data: {
        paperId: that.data.paperId,
        idsData: obj
      },
    }
    app.http(param).then((res) => {
   
      wx.redirectTo({
        url: '../answer-swiper-file/sc-moni-await/sc-moni-await',
      })
    }).catch(err => {
         // 具体参考 reject()
         if(err=='session已更新'){
          this.saveFn(obj) //重新调用该函数
  
        }else{
         
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
    })
  },
  // 交卷
  openTo() {
    var that = this
    // 单选答对数id数据
    var right1 = [] //答对的id
    var erro1 = [] //打错的id
    var nones1 = [] //未打的id

    // 多选答对数id数据
    var right2 = [] //答对的id
    var erro2 = [] //打错的id
    var nones2 = [] //未打的id

    // 多选答对数id数据
    var right3 = [] //答对的id
    var erro3 = [] //打错的id
    var nones3 = [] //未打的id

    // 单选遍历
    if (that.data.listData1) {
      that.data.listData1.list.map((v, i) => {
        if (!v.userAns) {
          nones1.push(v.id)
        }
        if (v.istrue == 2) {
          erro1.push(v.id)
        }
        if (v.istrue == 1) {

          right1.push(v.id)
        }
      })
    }

    // 语音遍历
    if (that.data.listData2) {
      that.data.listData2.list.map((v, i) => {

        if (!v.userAns) {
          nones2.push(v.id)
        }
      })
    }

    // 判断遍历
    if (that.data.listData3) {
      that.data.listData3.list.map((v, i) => {
        if (!v.isuser) {

          nones3.push(v.id)
        }
        if (v.istrue == 2) {

          erro3.push(v.id)
        }
        if (v.istrue == 1) {
          right3.push(v.id)
        }
      })
    }
    // id对应数据 开始 //
    var oneData = []
    var moreData = []
    var isorData = []
    oneData.push(right1, erro1, nones1)
    moreData.push(right2, erro2, nones2)
    isorData.push(right3, erro3, nones3)
    var obj = {
      one: oneData,
      is: isorData,
      audio: moreData,
     
    }
    obj = JSON.stringify(obj)



   that.saveFn(obj)



  },
  // 交卷准备
  showModalFn() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要交卷吗',
      success(res) {
        if (res.confirm) {
          // that.audioSubmit()
          that.openTo()
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.getListFn()
  },
  bindanimationfinish(e) {
    this.setData({
      current: e.detail.current
    });
  },
  // 数据
  getListFn() {
   
    var that=this
    var param = {
      url: '/api/subjects/generatePractical',
      data: {
        category_id: that.data.id,
      },
    }
    app.http(param).then((res) => {
     
      if (res.data.data.list[1]) {
        res.data.data.list[1].list.map(v => {
          v.userAns = '', //用户选择的答案
            v.istip = false //解析是否显示
          v.istrue = ''  //用户是否答对 
        })
      }
      if (res.data.data.list[3]) {
        res.data.data.list[3].list.map(v => {
          v.userAns = '', //用户是否选择
            v.istip = false //解析是否显示
        })
      }
      if (res.data.data.list[2]) {
        res.data.data.list[2].list.map(v => {
          v.userAns = '', //用户选择的答案
            v.istip = false //解析是否显示
          v.istrue = ''  //用户是否答对 
          v.isuser = '' //用户是否答过
        })
      }
      that.setData({
        listData1: res.data.data.list[1],
        listData2: res.data.data.list[3],  //注意，这里写的对的，这里没多选，后台是默认2是判断，所以这样写了
        listData3: res.data.data.list[2],
        list_length: res.data.data.count,
        title: res.data.data.title,
        paperId: res.data.data.paperId,
      })



    }).catch(err => {
         // 具体参考 reject()
         if(err=='session已更新'){
          this.getListFn() //重新调用该函数
  
        }else{
         
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
    })
  },
  //手指触摸开始赋值
  touchStart: function(e) {
    var that = this;
    var isrecord=true
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.record"]){
            wx.showToast({
              title: '请打开录音权限',
            })
          that.setData({
            tapFlag: false,
            audioText: '开始录音'
          })
        }
      }
    })

    var index = e.currentTarget.dataset.index
    if(that.data.listData2.list[index].userAns=='1'){
      wx.showToast({
        title: '不能重复答题哦',
      })
      return
    }
    that.setData({
      tapFlag:true,
      audioText:'正在录音'
    })
    that.startTime = e.timeStamp;
    var recorderManager = wx.getRecorderManager();
    const options = {

      sampleRate: 16000,

      numberOfChannels: 1,

      encodeBitRate: 96000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options);
  },
  //手指触摸结束赋值
  touchEnd: function(e) {
  
    var that = this;
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    const recorderManager = wx.getRecorderManager()
    const innerAudioContext = wx.createInnerAudioContext()

    that.setData({
      tapFlag: false
    })
    recorderManager.stop(); //先停止录音
    recorderManager.onStop((res) => { //监听录音停止的事件
      if (res.duration < 1000) {
        api.showToast('录音时间太短');
        return;
      } else {
        wx.showLoading({
          title: '发送中...',
        });
        that.setData({
          audioText: '按键回答'
        })
        var tempFilePath = res.tempFilePath; // 文件临时路径
        // var temp = tempFilePath.replace('.mp3', '') //转换格式 默认silk后缀
  
        wx.uploadFile({
          url: api + '/api/answers/storeAudio', //上传服务器的地址
          filePath: tempFilePath, //临时路径
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'cookie': wx.getStorageSync('xiaofang_session')
          },
          formData: {
            paperId: that.data.paperId,
            subjectId: id,
          },
          success: function(res) {
            that.data.listData2.list[index].userAns = '1'
            that.setData({
              listData2: that.data.listData2,
               audioText: '按键回答'
            })
            wx.hideLoading();
          },
          fail: function(err) {
            that.setData({
              audioText: '按键回答'
            })
            wx.hideLoading();
       
          }
        });
      }

    });
  },
  navNextFn() {
    //下一题
    var that = this
    if (that.data.current + 1 >= that.data.list_length) {
      return
    }
    that.setData({
      current: that.data.current + 1,
    })
  },
  navPreFn() {
    //上一题
    var that = this
    if (that.data.current > 0) {
      that.setData({
        current: that.data.current - 1
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearTimeout(this.data.timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})