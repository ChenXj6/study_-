// pages/subjcet/subjcet.js
const app = getApp()
const api = app.globalData.api
Page({
  data: {
    data: '',
    timer: '',
    windowWidth: '',
    hidden: false,
    logingText: '加载中...',
    data: '',
    id: '', //从上个页面传过来的id
    title: '',
    code: 1, //默认是1，是否调用返回数据成功
    topicData: {}, //题目数据
    topicDataMax:[],
    recordnum: { //记录答对多少题答错多少题
      right: 0,
      err: 0
    },
    ispopup: false, //是否显示弹出层，默认false关闭
    current: 0, //当前页
    list_length: '',
    ans: '', //正确答案
    eng: '', //选择的答案
    isIndex: 0,
    swiper_height: '90vh',
    paperId: '', //试卷id
    endTime: '',
    name_map_str: '', //对应的名称+option.id最后的值

    isUnload: true, //是否进行保存本地
    ismethod: '1', //默认是1练习模式，2为考试模式,3为背题模式
    issave: true, //退出是否保存到本地   //issave=true
    isbtn: 'true', //退出是否保存到本地   //issave=true
    istoggle:'false',//是否可以切换，默认false
    istoggle_num:0, //默认是0
    swiper_move_str:'', //是向右还是左
    startX:0,
    list_data:[], //为了实现选择列表

  },
  toggleMode(e){
    // 模式切换
    var num =e.currentTarget.dataset.num
    var sets=''
    if(this.data.istoggle_num==num)return 
    if(num==0){
      sets=1
    }else  if(num==1){
      sets=3
    }
    this.setData({
      ismethod:sets,
      istoggle_num:this.data.istoggle_num==0?'1':'0',
    })

    console.log(sets);
    
    
  },
  recordTimeFn(str){
    // 代表时间戳，不计算秒数
    var news =new Date().getTime()
    // console.log(news,'news');
    if(str=='reset'){
      // 重置答题时间
      wx.setStorageSync('xiaofang_time' + this.data.id,news)
    }else if(str=='go_on'){
      // 继续答题
      var a=wx.getStorageSync('xiaofang_time' + this.data.id) //让他把之前保存的时间戳跟现在的相加
      var go_ons=news-a
      wx.setStorageSync('xiaofang_time' + this.data.id,go_ons)
      // console.log(go_ons,'go_ons');
    }else if(str=='calc'){
      // 计算答题所用时间戳
      var result=news- wx.getStorageSync('xiaofang_time' + this.data.id)
      wx.setStorageSync('xiaofang_time' + this.data.id,result)  //计算所用时间戳
      wx.setStorageSync('result_time',result/1000)   //保存秒数，只有在交卷的时候才用到
    }
  },
  bindanimationfinish(e) {
    this.setData({
      current: e.detail.current,

    });
  },
  tapItemTopic(e) {
    // 跳转某一题
var current= e.currentTarget.dataset.index
 var  topicData=  wx.getStorageSync('xiaofang_topicDataMax').current
    this.setData({
      current:current,
      ispopup: false,
      topicData: topicData
    });
  },
  onLoad: function (options) {


    var name = wx.getStorageSync('xiaofang_name')
    var name_map_str = ''
    // answer-test只有这个4个用这个页面，另一个不是这几个
    if (name == "随机小练") {

      name_map_str = 'sjxl'


    } else if (name == "历年真题") {
      name_map_str = 'lnzt'



    } else if (name == "顺序练习") {
      name_map_str = 'sxlx'
    } 

    else if (name == "章节练习") {

      name_map_str = 'zjlx'


    } else if (name == "我的收藏") {

      name_map_str = 'wdsc'
    } else if (name == "全部答案") {

      name_map_str = 'qbda'
    } else if (name == "错题答案") {

      name_map_str = 'ctda'
    }


    name_map_str = 'xiaofang_' + name_map_str + options.id //拼接起来
    var that = this


    that.setData({
      id: options.id,
      ismethod: options.ismethod || 1, //默认值为1
      issave: options.issave || true, //默认使用保存本地
      isbtn: options.isbtn || 'true', //默认值为字符'true'
      istoggle: options.istoggle || 'false', //是否可以切换，默认false
      name_map_str: name_map_str
    })
    // 判断是继续答题还是重弄答题





    if (wx.getStorageSync(this.data.name_map_str11)) {
      wx.showModal({
        title: '提示',
        content: '是否继续答题',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中',
              mask: true,
            })

            var obj = wx.getStorageSync(that.data.name_map_str)

            // console.log(obj);
            // 如果继续答题，就把保存本地的数据拿出来，进行赋值渲染
            that.setData({
              topicData: obj.topicData,
              list_length: obj.list_length,
              title: obj.title,
              paperId: obj.paperId,
              current: obj.current,
              recordnum: obj.recordnum//记录答对多少题答错多少题
            })

            setTimeout(function () {
              wx.hideLoading()
            }, 1000)

            that.recordTimeFn("go_on")
          } else if (res.cancel) {
            wx.showLoading({
              title: '加载中',
              mask: true,
            })
            that.getListFn().then(res => {
              that.recordTimeFn("reset")
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
            })
            wx.removeStorageSync(that.data.name_map_str)
          }
        }
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      that.getListFn().then(res => {
        that.recordTimeFn("reset")



        
        console.log(22222);
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      })
    }

  },
  showModalFn() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要交卷吗',
      success(res) {
        if (res.confirm) {
          that.openTo()
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  togglePopup() {
    this.setData({
      ispopup: !this.data.ispopup
    });
  },
  touchStart: function (e) {
    if (e.touches.length == 1) {


      this.data.startX=e.touches[0].clientX
    }
  },
  touchMove: function (e) {
    if (e.touches.length == 1) {
      // var moveX = e.touches[0].clientX;
      // var diffX = this.data.startX - moveX;
      // var moveLeft = '';
      // if (diffX < 0) { //向右
      //   moveLeft = 'left:' + -(diffX < -90 ? -90 : diffX) + 'px;';
      // } else if (diffX > 0) { //向左
      //   moveLeft = 'left:-' + (diffX > 90 ? 90 : diffX) + 'px;';
      // }else{
      //   moveLeft = 'left:0px;';
      // }

    }
  },
  tapItemTopic2(e){
  var   c=e.currentTarget.dataset.index
    var data=this.data

  var  topicDataMax=  wx.getStorageSync('xiaofang_topicDataMax')
    this.setData({
      current:c,
      topicData:topicDataMax[c],
      ispopup: false

    });

  },
// 是否可以++
  iscurrentFn(source){
    var data=this.data

    // console.log(typeof(source));
    
    if(typeof(source)!='string'){
      source=source.currentTarget.dataset.source

    }
    var topicDataMax=  wx.getStorageSync('xiaofang_topicDataMax')
    if(source=='right'){

 
if(data.current<data.list_length-1){
    var currents1=data.current+1

// console.log(data.list_length);

// console.log(data.current);
    // console.log(topicDataMax[currents1]);
  this.setData({
    current:currents1,
    topicData:topicDataMax[currents1]



  });

}
    }else   if(source=='left'){
      if(data.current>0){
        // console.log(data.topicDataMax[currents2]);
        
        var currents2=data.current-1
        this.setData({
          current:currents2,
          topicData:topicDataMax[currents2]
        });
      }
    }

  },
  touchEnd: function (e) {
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var diffX = this.data.startX - endX;

   
    
      var str=''
      if(diffX>50){
        // 滑动大于50


        str="right"
        this.iscurrentFn(str)
        // this.setData({
        //   swiper_move_str: str
        // });
      }else if(diffX<-50){


        str="left"

        this.iscurrentFn(str)
        // this.setData({
        //   swiper_move_str: str
        // });
      }
      // this.setData({
      //   swiper_move_str: str
      // });

      // console.log(str);
      
    }
  },
  // 数据

  getListFn() {
    var that = this

    return new Promise((resolve, reject) => {


      var param = {}

      var names = wx.getStorageSync('xiaofang_name')
      // if (names == "随机小练") {

      //   param = {
      //     url: '/api/subjects/getSimulationTest',

      //   }
      // } 
      param = {
        url: '/api/subjects/myCollect',

      }
      

      // console.log(param);
      app.http(param).then((res) => {
        var data = []
        // var list_data=[]
        var listdata = res.data.data
        for (var i in listdata.list) {
          listdata.list[i].list.map((vv, ii) => {
            vv.isquestion = ''; //是否答对了,1是答对了，2是没答对
            vv.istip = false //提示是否出现
            // list_data.push(vv.type)

          vv.is_collect=1 //我的收藏用到
            if (vv.type == 2) {
              vv.user_answer = []; //用户选择的答案 //2是多选就用数组
              vv.isconfirm = false //针对多选题，是否点击了确定按钮
            } else {
              vv.user_answer = ''; //用户选择的答案
            }
            data.push(vv)
          })
        }
    
        // console.log(this.data.current);
        var  oneData=JSON.parse(JSON.stringify(data[this.data.current])) //当前一个
        // console.log(data[this.data.current] );
        // console.log(oneData);
     

        that.setData({
          topicData: oneData,
          list_length: listdata.count,
          paperId: listdata.paperId,
          title:listdata.title,
          code: 1,
        })
        wx.setStorageSync('xiaofang_topicDataMax',data)
        resolve(1)
  

      }).catch(err => {
        // 具体参考 reject()
        if (err == 'session已更新') {
          this.getListFn() //重新调用该函数

        } else {
          wx.hideLoading()
          that.setData({
            code: 0,
          })
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
    })

  },

  /**@功能：点击某个选项
   * @param {当前屏数下标,点击选项下标,正确答案,类型}
   * */
  incCurrentFn(e) {

    if (this.data.ismethod == 3) return //模式3是背题模式
    // console.log(e.currentTarget.dataset);

    var index = e.currentTarget.dataset.index

    // console.log(index);
    
    var i = e.currentTarget.dataset.i
    var data = this.data.topicData;


    var type = e.currentTarget.dataset.type
    // if (this.data.ismethod==1){
    //   if(type!=2){
    //     if(data.isquestion!='')return
    //   }
    // }



    if (i == data.user_answer) return //处理重复点击

    // console.log(data.user_answer);


    var trues = e.currentTarget.dataset.right_answer
    trues = trues.replace(/\s+/g, "");


    var strTrue = trues.toUpperCase();

    var answer_num = 0 //答题数,答对是1,答错是2
    var firsh
    if (data.isquestion == '') {
      firsh = ''
    } else {
      firsh = data.isquestion
    }



    if (type == 1) {
      // 单选
      data.user_answer = i.slice(-1);
      if (i.slice(-1) == strTrue) {
        //当前的选择的题序号等于答案，对题数加一
        data.isquestion = '1'; //说明用户答对了
        data.istip = false; //是否出现提示 false不出现，true出现

        answer_num = 1 //答题数,答对是1,答错是2

      } else {
        data.isquestion = '2'; //说明用户答错了
        data.istip = true; //是否出现提示 false不出现，true出现
        answer_num = 2 //答题数,答对是1,答错是2
      }
    } else if (type == 2) {
      // 多选

      // console.log(data.isconfirm);
      if (data.isconfirm) {

        return
      }
      if (data.user_answer.indexOf(i.slice(-1)) > -1) {
        var indexOf_index = data.user_answer.indexOf(i.slice(-1));

        data.user_answer.splice(indexOf_index, 1);
      } else {
        data.user_answer.push(i.slice(-1));
      }

      var result = data.user_answer.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0)); //a~z 排序
      data.user_answer = result

      // console.log(result);

      if (strTrue == result) {
        data.isquestion = '1'; //说明用户答对了
      } else {
        data.isquestion = '2'; //说明用户答错了
      }
    } else if (type == 3) {
      // 判断
      data.user_answer = i;
      trues == 0 ? trues = 2 : '' //因为后台传的是0和1，我写的是1和2，在这里统一修改下
      if (i == trues) {
        data.isquestion = '1'; //说明用户答对了
        data.istip = false; //是否出现提示 false不出现，true出现
        answer_num = 1 //答题数,答对是1,答错是2
      } else {
        data.isquestion = '2'; //说明用户答错了
        data.istip = true; //是否出现提示 false不出现，true出现
        answer_num = 2//答题数,答对是1,答错是2
      }
    }
    // console.log(firsh, 'firsh');

    // 计算答对错题数
    if (firsh == '') {
      // 
      if (answer_num == 1) this.data.recordnum.right += 1
      else if (answer_num == 2) this.data.recordnum.err += 1
    } else {
      if (firsh != data.isquestion) {
        // 上一次的答案和当前的答案保证不一致，
        if (answer_num == 1) {
          this.data.recordnum.right += 1
          this.data.recordnum.err -= 1

        } else if (answer_num == 2) {
          this.data.recordnum.right -= 1
          this.data.recordnum.err += 1
        }
      }
    }


     

    var topicDataMax= wx.getStorageSync('xiaofang_topicDataMax')

   topicDataMax[this.data.current]= JSON.parse(JSON.stringify(this.data.topicData))
    wx.setStorageSync('xiaofang_topicDataMax',topicDataMax)

    this.setData({
      topicData: this.data.topicData,
      recordnum: this.data.recordnum

      // [isquestion_set ]: data.isquestion ,
      // [user_answer_set ]: data.user_answer ,
    })


    // console.log(this.data.topicData[index]);

  },
  // confirmFn 多选的确定按钮
  confirmFn(e) {
    var that = this
    var index = e.currentTarget.dataset.index //对应数组的下标
    var tip
    var con_data = that.data.topicData


    if (con_data.isconfirm) return  //确定了就不让他点了
    if (con_data.isquestion == 1) {
      tip = false
      con_data.istip = false //istip单选和判断是在incCurrentFn函数中，多选需要点击确定按钮所以需要些到这里


      that.data.recordnum.right += 1


    } else if (con_data.isquestion == 2) {
      tip = true
      con_data.istip = true


      that.data.recordnum.err += 1
    }

    var one_isconfirm = "topicData.isconfirm"
    var one_istip = "topicData.istip"
    that.setData({
      [one_isconfirm]: true,
      [one_istip]: tip,
      recordnum: that.data.recordnum
    })

    
    var topicDataMax= wx.getStorageSync('xiaofang_topicDataMax')

   topicDataMax[this.data.current]= JSON.parse(JSON.stringify(this.data.topicData))
    wx.setStorageSync('xiaofang_topicDataMax',topicDataMax)
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

    //选项遍历
    if (that.data.topicData) {
      that.data.topicData.map((v, i) => {
        if (v.type == 1) {
          // 单选
          if (v.isquestion == 1) {
            right1.push(v.id)
          } else if (v.isquestion == 2) {
            erro1.push(v.id)
          } else if (v.isquestion == '') {
            nones1.push(v.id)
          }
        } else if (v.type == 2) {
          // 多选
          if (v.isquestion == 1) {
            right2.push(v.id)
          } else if (v.isquestion == 2) {
            erro2.push(v.id)
          } else if (v.isquestion == '') {
            nones2.push(v.id)
          }
        } else if (v.type == 3) {
          // 判断
          if (v.isquestion == 1) {
            right3.push(v.id)
          } else if (v.isquestion == 2) {
            erro3.push(v.id)
          } else if (v.isquestion == '') {
            nones3.push(v.id)
          }
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
      more: moreData,
      is: isorData
    }
    obj = JSON.stringify(obj)

    // id对应数据 结束 //
    wx.removeStorageSync(this.data.name_map_str)
    that.setData({
      isUnload: false
    })

    that.recordTimeFn("calc")
    wx.redirectTo({
      url: '../answer-result/answer-result?category_id=' + that.data.id + '&idsData=' + obj + '&paperId=' + that.data.paperId,
    })

  },

  // 收藏此题
  shoucanFn() {
    var data = this.data.topicData
    var id = data.id
    var iscollect = data.is_collect

    var param = {
      url: '',
      data: {
        subject_id: id
      }
    }
    if (iscollect == 0) {

      param.url = '/api/Customers/collectSubject'
    } else if (iscollect == 1) {
      param.url = '/api/Customers/cancelCollectSubject'
    }

    app.http(param).then((res) => {
      // console.log(res);


      iscollect = iscollect == 0 ? '1' : '0'
      var changeOne = "topicData.is_collect";
      this.setData({
        [changeOne]: iscollect
      })
      var topicDataMax= wx.getStorageSync('xiaofang_topicDataMax')

      topicDataMax[this.data.current]= JSON.parse(JSON.stringify(this.data.topicData))
       wx.setStorageSync('xiaofang_topicDataMax',topicDataMax)


      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })


    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.shoucanFn() //重新调用该函数

      } else {

        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })

  },


  forbidMove(e) {

    return;
  }, //禁止滑动
  navNextFn() {
    //下一题
    var that = this
    if (that.data.current + 1 >= that.data.list_length) {
      return
    }
    that.setData({
      current: that.data.current + 1,
      shoucanId: '', //每次把收藏id清空 
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

  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    if (this.data.issave == 'false' || this.data.issave == false) return //如果传了是false就不保存本地

    var that = this.data //这里注意下

    // if (that.topicData.length != 0) {
    //   if (that.isUnload) {
    //     var obj = {
    //       topicData: [],
    //       list_length: '',
    //       title: '',
    //       paperId: '',
    //     }

    //     obj.topicData = that.topicData
    //     obj.list_length = that.list_length
    //     obj.title = that.title
    //     obj.paperId = that.paperId
    //     obj.current = that.current
    //     obj.recordnum = that.recordnum //记录答对多少题答错多少题
    //     wx.setStorageSync(that.name_map_str, obj)
    //   }
    // }



    this.onUnloadFn(that)
  },
  onUnloadFn(that) {

    // 只有历年真题和章节练习需要传。别的不需要记录  //上面做了拼接。所以这么写
    if (that.name_map_str != `xiaofang_lnzt${that.id}` && that.name_map_str != `xiaofang_zjlx${that.id}`) return
    var str = ''
    if (that.name_map_str == 'xiaofang_lnzt') {
      str = '1'  //1的时候代表历年真题	
    }
    var param = {
      url: '/api/customers/storeSubjectProcess',
      method: "POST",
      data: {
        count: that.current + 1,
        category_id: that.id,
        is_true: str
      },
    }
    app.http(param).then((res) => {

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.onUnloadFn(that)//重新调用该函数

      } else {

      }
    })


// 另一个
    var param = {
      url: '/api/customers/updatePaperProcess',
      method: "POST",
      data: {
        times: Math.floor(wx.getStorageSync('result_time')),
        num:that.current+1,
        paper_id: that.paperId,
      },
    }
    app.http(param).then((res) => {

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.onUnloadFn(that)//重新调用该函数

      } else {

      }
    })
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

  },
  onReady() {
    // wx.getSystemInfo({
    //   success(res) {
    //     this.setData({
    //       windowWidth: res.windowWidth
    //     })
    //   }
    // });
  }

})