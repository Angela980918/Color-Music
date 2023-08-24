// pages/home-video/home-video.js
// 请求接口
import { getTopMV } from "../../service/api_video";
// import { MusicRequest } from "../../service/index";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
  },

  // 封装MV网络请求函数
  async fetchTopMVData() {
    const res = await getTopMV()
    this.setData({
      videoList: res.data
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchTopMVData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
