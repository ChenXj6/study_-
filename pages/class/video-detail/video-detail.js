const app = getApp()
const api = app.globalData.api
var time = require("../../../utils/util.js").default.getTimes


Page({
  data: {
    index: 0, //一级页面中区分视频音频阅读
    isfocus: false,
    page: 1,
    hidden: false,
    logingText: '加载中...',
    img: app.globalData.img,
    api: app.globalData.api,
    list: {},
    title: '', // 文章title
    commentData: [], //评论一级数据
    id: '',
    type: '2', //类型：1=文章2=课程	
    content: '', //评论文章的内容
    pid: 0, //判断是否评论文章,和评论的id
    pidIndex: '',
    inputText: '文章',
    review_id: '',
    more_index: '', //查看更多的id
    more_page: 1, //展开更多页数
    isShouqi: true, //收起的开关
    shouqiIndex: 2, //收起的开关
    is_like: '', //是否点赞
    isbindblur: true,
    // 
    url: app.globalData.url,
    list: {},
    id: '', //分类ID
    videoTime: '', //视频进度
    total_length: 0, //	视频长度
    /**
     * 音频相关开始
     * */
    innerAudioContext: {}, // 音频


    isPlayAudio: false,
    audioSeek: 0,
    audioDuration: 0,
    showTime1: '00:00',
    showTime2: '00:00',
    audioTime: 0
    /**
     * 音频相关结束
     * */

  },
  // 监听
  onReachBottom: function () {
    var that = this
    if (that.data.hidden == false) {
      return;
    }
    that.data.page++
    that.getCommentFn(that.data.id, that.data.type)
  },
  onLoad: function (options) {
    var that = this

    // 保存变量
    that.data.id = options.id

    that.setData({
      id: options.id,
      index: options.index
    })

    if (options.index == 2) {
      // 说明是音频
      that.data.innerAudioContext = wx.createInnerAudioContext();
      wx.setInnerAudioOption({

        mixWithOther:true,
        obeyMuteSwitch:false,
        success:(suc)=>{
            console.log(suc);
            
        },fail:(fail)=>{
          console.log(fail);
        }
      })

      wx.setNavigationBarTitle({
        title: '音频',
      })
    }else{
      // 说明是视频

      wx.setNavigationBarTitle({
        title: '视频',
      })
    }

    that.getDetail()
    that.getCommentFn(options.id, options.type)

  },
  onShow: function () {},
  // 视频时间
  bindtimeupdate(e) {
    this.data.videoTime = e.detail.currentTime
    this.data.total_length = e.detail.duration
  },
  // 获取详情数据
  getDetail() {
    var that = this
    var param = {
      url: '/api/lessons/detail',
      data: {
        lesson_id: that.data.id
      }
    }
    app.http(param).then((res) => {

      res.data.data.create_time =that.formatDate(res.data.data.create_time*1000)

      var reg = /([\u4e00-\u9fa5]+)/g;


      res.data.data.video=res.data.data.video.replace(reg,(p1=>{
          return encodeURIComponent(p1)
        }))
      that.setData({
        list: res.data.data
      })
      console.log( res.data.data.video);
      

      if (that.data.index == 2) {
        // 音频

        that.Initialization()
        that.loadaudio();
      }

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.getDetail() //重新调用该函数

      } else {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },
  // 一级评论
  getCommentFn() {

    var that = this
    var param = {
      url: '/api/reviews/getArticleReviews',
      data: {
        page: that.data.page,
        article_id: that.data.id,
        type: 2
      },
    }
    app.http(param).then((res) => {

      if (res.data.data.data.length != 0) {
        that.setData({
          hidden: true,
          logingText: '加载中...'
        })
        res.data.data.data.map(v => {
          v.create_time = time(v.create_time)
          v.isShouqi = "1"
        })
        if (that.data.page == 1) {
          that.setData({
            commentData: res.data.data.data,
          });
        } else {
          var list = that.data.commentData;
          that.setData({
            commentData: list.concat(res.data.data.data),
          });
        }
        if (that.data.page >= res.data.data.last_page) {
          that.setData({
            logingText: '---暂无更多---',
            hidden: false,
          });
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
        this.getCommentFn() //重新调用该函数

      } else {
        that.setData({
          logingText: '---暂无更多---'
        })
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },
  nolikeTapFn(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var param = {
      url: '/api/thumbsups/reviewCancelThumbsup',
      data: {
        review_id: id
      },
    }
    app.http(param).then((res) => {

      var indexs = e.currentTarget.dataset.index
      that.data.commentData[indexs].thumbsup_num -= 1
      that.data.commentData[indexs].is_like = 0




      // var changeis_like = "commentData[" + indexs+ "].is_like"; 
      // var changethumbsup_num = "commentData[" + indexs+ "].thumbsup_num"; 
      // this.setData({
      // [changeis_like ]:0,   //中括号括起来，不然无效
      // [changethumbsup_num ]: that.data.commentData[indexs].thumbsup_num,
      // })

      that.setData({
        commentData: that.data.commentData
      })
    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.nolikeTapFn(e) //重新调用该函数

      } else {
        this.setData({
          hidden: false,
          logingText: '---暂无更多---'
        })
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })

  },
  // 点赞
  likeTapFn(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var param = {
      url: '/api/thumbsups/reviewThumbsup',
      data: {
        review_id: id
      },
    }
    app.http(param).then((res) => {
      var indexs = e.currentTarget.dataset.index
      that.data.commentData[indexs].thumbsup_num += 1
      that.data.commentData[indexs].is_like = 1
      that.setData({
        commentData: that.data.commentData
      })


    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.likeTapFn(e) //重新调用该函数

      } else {
        this.setData({
          hidden: false,
          logingText: err
        })
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },
  // 获取焦点
  focusFn(e) {

    this.setData({
      isfocus: true,
      inputText: e.currentTarget.dataset.inputtx || '匿名用户',
      pid: e.currentTarget.dataset.id,
      pidIndex: e.currentTarget.dataset.pidindex,
    })
  },
  // input
  bindinput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  bindblur() {
    // 评论成功后焦点指向文章

    if (this.data.isbindblur) {
      this.setData({
        pid: 0,
        inputText: '文章'
      })
    }
  },



  reviewFn() {
    // 评论
    var that = this
    var param = {
      url: '/api/reviews/store',
      data: {
        article_id: that.data.id,
        type: that.data.type,
        content: that.data.content,
        pid: that.data.pid
      },
    }
    app.http(param).then((res) => {
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })

      that.setData({
        content: '',
        pid: 0,
        inputText: '文章',
        hidden: true,
      })
      that.getCommentFn()

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        that.reviewFn() //重新调用该函数



      } else {

        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })

  },
  // bindconfirm回复文章
  bindconfirm() {
    var that = this

    if (!that.data.content) return


    that.setData({
      isbindblur: false,
    })
/**
 * 原id:wx83af43dc427e10d2
 * 原secret:1e5c28c15d4c6b18e9255b243a060ffd
 * */ 
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      data: {
        grant_type: 'client_credential',
        appid: 'wxe3c8195b702cde37',
        secret: '8e5f747935e3a404ba5a374ee7e19e16'
        // appid: 'wx83af43dc427e10d2',
        // secret: '1e5c28c15d4c6b18e9255b243a060ffd'
      },
      success: (res1) => {
        wx.request({
          url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + res1.data.access_token,
          header: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          data: {
            content: that.data.content
          },
          success: res2 => {
            // console.log(res2)
            if (res2.data.errcode == 0) {

              that.reviewFn() //过滤完调用

            }
          },
          fail() {
            // console.log(res);
          }
        })
      },
    })

  },

  //  查看更多评论
  moreClick(e) {
    var that = this
    that.setData({
      more_index: e.currentTarget.dataset.index
    })
    var review_id = e.currentTarget.dataset.review_id
    if (e.currentTarget.dataset.more == 1) {
      that.data.more_page++
      that.setData({
        more_page: that.data.more_page
      })
    } else {
      that.setData({
        more_page: 1
      })
    }

    var param = {
      url: '/api/reviews/getSecondReview',
      data: {
        review_id: review_id,
        page: that.data.more_page
      },
    }
    app.http(param).then((res) => {
      if (that.data.more_page == 1) {
        var datas = res.data.data.data
        that.data.commentData[that.data.more_index].reply_content = datas
        that.setData({
          commentData: that.data.commentData
        })
        if (that.data.more_page < res.data.data.last_page) {
          that.data.commentData[that.data.more_index].isShouqi = 2
          that.setData({
            commentData: that.data.commentData
          })
        } else if (that.data.more_page == res.data.data.last_page) {
          that.data.commentData[that.data.more_index].isShouqi = 3
          that.setData({
            commentData: that.data.commentData
          })
        }
      } else { //不是只有一页的时候
        if (that.data.more_page <= res.data.data.last_page) { //不是只有一页的时候且还有比如第3页
          that.data.commentData[that.data.more_index].isShouqi = 2
          var datas = res.data.data.data
          var list2 = that.data.commentData[that.data.more_index].reply_content
          that.data.commentData[that.data.more_index].reply_content = list2.concat(datas)
          that.setData({
            commentData: that.data.commentData
          })
        }
        if (that.data.more_page == res.data.data.last_page) {
          that.data.commentData[that.data.more_index].isShouqi = 3
          that.setData({
            commentData: that.data.commentData
          })
        }
      }



    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.moreClick(e) //重新调用该函数

      } else {

        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })

  },
  // 收起
  moreShouqi(e) {
    var that = this
    var a = e.currentTarget.dataset.index
    that.data.commentData[a].isShouqi = 1
    that.data.commentData[a].reply_content = that.data.commentData[a].reply_content.slice(0, 2)
    that.setData({
      commentData: that.data.commentData
    })
  },
  saveWatchVideoProcess() {
    var that = this

    if(!this.data.total_length)return //如果是0说明是没有快速点击导致的，0就不给传了
    var param = {
      url: '/api/customers/storeWatchVideoProcess',
      data: {
        total_length: this.data.total_length,
        curriculum_id: this.data.id,
        length: this.data.videoTime||1
      },
    }
    app.http(param).then((res) => {

    }).catch(err => {
      // 具体参考 reject()
      if (err == 'session已更新') {
        this.saveWatchVideoProcess() //重新调用该函数

      } else {

        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },
   formatDate(date) {
    var date = new Date(date);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD +" "+hh + mm + ss;
  },
  onUnload: function () {
    var that=this
    if (that.data.index == 1) {
      this.saveWatchVideoProcess()
    } else {
      that.data.innerAudioContext.pause()
      that.data.innerAudioContext = {}
    }
    //卸载页面，清除计步器
    clearInterval(that.data.durationIntval);
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

  },








  /**
   * 音频相关开始
   * https://blog.csdn.net/weixin_44261007/article/details/105555919?utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~all~first_rank_v2~rank_v25-5-105555919.nonecase&utm_term=%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%9F%B3%E9%A2%91%E6%A0%B7%E5%BC%8F%E6%80%8E%E4%B9%88%E4%BF%AE%E6%94%B9
   * */
  //初始化播放器，获取duration
  Initialization() {
    var t = this;

    var innerAudioContext = t.data.innerAudioContext
    //设置src

   
    



    innerAudioContext.src = t.data.url+ t.data.list.video
    console.log(innerAudioContext.src);
    console.log(t.data.url+ t.data.list.video);
    console.log(innerAudioContext);
    
    //运行一次
    innerAudioContext.play();
    innerAudioContext.pause();
  
    innerAudioContext.onCanplay(() => {
      //初始化duration
      setTimeout(function () {
        //延时获取音频真正的duration
        var duration = innerAudioContext.duration;
        var min = parseInt(duration / 60);
        var sec = parseInt(duration % 60);
        if (min.toString().length == 1) {
          min = `0${min}`;
        }
        if (sec.toString().length == 1) {
          sec = `0${sec}`;
        }
        t.setData({
          audioDuration: innerAudioContext.duration,
          showTime2: `${min}:${sec}`
        });
      }, 1000)
    })

  },
  //拖动进度条事件
  sliderChange(e) {
    var that = this;
    var innerAudioContext = this.data.innerAudioContext
    innerAudioContext.src =   this.data.url+this.data.list.video
    //获取进度条百分比
    var value = e.detail.value;
    this.setData({
      audioTime: value
    });
    var duration = this.data.audioDuration;
    //根据进度条百分比及歌曲总时间，计算拖动位置的时间
    value = parseInt(value * duration / 100);
    //更改状态
    this.setData({
      audioSeek: value,
      isPlayAudio: true
    });
    //调用seek方法跳转歌曲时间
    innerAudioContext.seek(value);
    //播放歌曲
    innerAudioContext.play();
  },
  //播放、暂停按钮
  playAudio() {
    //获取播放状态和当前播放时间
    var innerAudioContext = this.data.innerAudioContext
    var isPlayAudio = this.data.isPlayAudio;
    var seek = this.data.audioSeek;
    innerAudioContext.pause();
    //更改播放状态
    this.setData({
      isPlayAudio: !isPlayAudio
    })
    if (isPlayAudio) {
      //如果在播放则记录播放的时间seek，暂停
      this.setData({
        audioSeek: innerAudioContext.currentTime
      });
    } else {
      //如果在暂停，获取播放时间并继续播放
      innerAudioContext.src =  this.data.url+this.data.list.video
      if (innerAudioContext.duration != 0) {
        this.setData({
          audioDuration: innerAudioContext.duration
        });
      }
      //跳转到指定时间播放
      innerAudioContext.seek(seek);
      innerAudioContext.play();
    }
  },
  loadaudio() {
    var that = this;

    var innerAudioContext = this.data.innerAudioContext
    //设置一个计步器
    this.data.durationIntval = setInterval(function () {
      //当歌曲在播放时执行
      if (that.data.isPlayAudio == true) {
        //获取歌曲的播放时间，进度百分比
        var seek = that.data.audioSeek;
        var duration = innerAudioContext.duration;
        var time = that.data.audioTime;
        time = parseInt(100 * seek / duration);
        //当歌曲在播放时，每隔一秒歌曲播放时间+1，并计算分钟数与秒数
        var min = parseInt((seek + 1) / 60);
        var sec = parseInt((seek + 1) % 60);
        //填充字符串，使3:1这种呈现出 03：01 的样式
        if (min.toString().length == 1) {
          min = `0${min}`;
        }
        if (sec.toString().length == 1) {
          sec = `0${sec}`;
        }
        var min1 = parseInt(duration / 60);
        var sec1 = parseInt(duration % 60);
        if (min1.toString().length == 1) {
          min1 = `0${min1}`;
        }
        if (sec1.toString().length == 1) {
          sec1 = `0${sec1}`;
        }
        //当进度条完成，停止播放，并重设播放时间和进度条
        if (time >= 100) {
          innerAudioContext.stop();
          that.setData({
            audioSeek: 0,
            audioTime: 0,
            audioDuration: duration,
            isPlayAudio: false,
            showTime1: `00:00`
          });
          return false;
        }
        //正常播放，更改进度信息，更改播放时间信息
        that.setData({
          audioSeek: seek + 1,
          audioTime: time,
          audioDuration: duration,
          showTime1: `${min}:${sec}`,
          showTime2: `${min1}:${sec1}`
        });
      }
    }, 1000);
  },

})