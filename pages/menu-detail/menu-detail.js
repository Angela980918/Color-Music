// pages/menu-detail/menu-detail.js
import { getMusicMenuTags, getMusicMenu } from "../../service/api_music";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musicMenu: [], // 歌单列表
  },

  async fetchMusicMenuTags() {
    const res = await getMusicMenuTags();
    console.log(res);

    // 1.获取tags
    const tags = res.tags;

    // 2.根据tags获取对应的歌单detail
    const AllPromise = [];
    for (const tag of tags) {
      // console.log(tag.name);
      const promise = getMusicMenu(tag.name);
      AllPromise.push(promise);
    }

    // 3.等待所有的Promise执行完毕
    Promise.all(AllPromise).then((res) => {
      // console.log("AllPromise", res);
      this.setData({
        musicMenu: res,
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchMusicMenuTags();
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
