// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../service/api_player";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0, // 歌曲id
    currentSong: {}, // 当前播放歌曲
    songLyric: {}, //歌词

    statusHeight: 20, // 状态栏高度
  },

  async fetchSongDetail(id) {
    const res = await getSongDetail(id);
    console.log("fetchSongDetail", res);
    this.setData({
      currentSong: res.songs[0],
    });
  },

  async fetchSongLyric(id) {
    const res = await getSongLyric(id);
    console.log("fetchSongLyric", res);
    this.setData({
      songLyric: res.lrc.lyric,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log("options", options);
    // 1.获取歌曲id
    const id = options.id;
    this.setData({ id });
    this.fetchSongDetail(id);
    this.fetchSongLyric(id);

    // 设备信息
    this.setData({ statusHeight: app.globalData.statusBarHeight });
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
