// pages/set/set.js
//获取应用实例
const app = getApp()
const api = app.globalData.api
const url = app.globalData.url
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
 
    userimg: '',
    nickname: '',
    phone: '',
    password:'',
    sex:0,//默认男
    has_pwd:'1',//是否填写了密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListFn()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  editImgFn() {
    this.chooseImageTap()
  },
  // input
  bindinput(e) {

    this.setData({
      nickname: e.detail.value
    })
  },
  // 密码
  bindinput2(e) {

    this.setData({
      password: e.detail.value
    })
  },

  
  // 上传
  chooseImageTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {

        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  // 图片本地路径
  chooseWxImage: function (type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {

        that.upImgs(res.tempFilePaths[0])
      }
    })
  },
  //上传服务器
  upImgs: function (imgurl) {
    var that = this;



    wx.uploadFile({
      url: api + 'api/common/ossUploadFile',
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': wx.getStorageSync('xiaofang_session')
      },
      success: function (res) {
        var datas = JSON.parse(res.data)
        console.log(datas);
        
        if (datas.code == 1) {
          that.setData({
            userimg: url + datas.data
          })

        } else {
          wx.showToast({
            title: datas.msg,
            icon: 'none'
          })
        }
      }
    })
  },




  // 用户数据
  getListFn() {
    var that = this
 
    var param = {
      url: '/api/Customers/getCustomerInfo',
    }
    app.http(param).then((res) => {
      that.setData({
        userimg: res.data.data.avatar,
        nickname: res.data.data.nickname,
        phone: res.data.data.phone,
        sex: res.data.data.sex,
        has_pwd:res.data.data.has_pwd, //是否填写了密码

      });


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


  tapSex(e){
    var num=e.currentTarget.dataset.num
    this.setData({
        sex:num
    })
  },
  editFn() {
    var that = this

    if(!that.data.nickname){
      wx.showToast({
        title:'请填写姓名',
        icon: 'none'
      })
      return
    }
    // 如果第一次没有设置过密码就必须填写密码
    if(that.data.has_pwd==0){
      if(!that.data.password){
        wx.showToast({
          title:'请设置登录密码',
          icon: 'none'
        })
        return
      }
    }
    var param = {
      url: '/api/Customers/updateCustomerInfo',
      data: {
        nickname: that.data.nickname,
        avatar: that.data.userimg,
        sex: that.data.sex,
      },
    }
    if(that.data.password){
      param.data.password=that.data.password
    }
    app.http(param).then((res) => {
      // console.log(res);
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
      if(that.data.has_pwd==0){
        // 目的：如果跳个人中心页面就获取不到在首页的导航栏了
        setTimeout(function () {
          wx.switchTab({
            url: '../../index/index',
          })
         }, 300)
      }else{
        // 正常情况下
        setTimeout(function () {
          wx.switchTab({
            url: '../user',
          })
         }, 300)


      }





    }).catch(err => {
      // 具体参考 reject()
      if(err=='session已更新'){
        this.editFn() //重新调用该函数

      }else{
       
        wx.showToast({
          title: err,
          icon: 'none'
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})