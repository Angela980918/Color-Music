// pages/home-music/home-music.js
import { getMusicBanner } from "../../service/api_music";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "", // 查询关键字
    bannerImg: [], // 轮播图
  },

  // 搜索框事件监听
  onSearchClick() {
    console.log("点击了搜索框");
    wx.navigateTo({
      url: "/pages/search-detail/search-detail",
    });
  },

  // 获取banner数据
  async fetchBannerData() {
    const res = await getMusicBanner();
    // console.log("banner:", "res");
    this.setData({
      bannerImg: res.banners,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchBannerData();
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
