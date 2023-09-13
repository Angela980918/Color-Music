// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../service/api_player";
const app = getApp();
// 创建播放器
const audioContext = wx.createInnerAudioContext();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0, // 歌曲id
    currentSong: {}, // 当前播放歌曲
    songLyric: {}, //歌词

    statusHeight: 20, // 状态栏高度
    contentHeight: 0, // 内容区域高度
    currentPage: 0, // 默认选择歌曲
  },

  /**
   * 获取歌曲详情
   */
  async fetchSongDetail(id) {
    const res = await getSongDetail(id);
    console.log("fetchSongDetail", res);
    this.setData({
      currentSong: res.songs[0],
    });
  },

  /**
   * 获取歌词详情
   */
  async fetchSongLyric(id) {
    const res = await getSongLyric(id);
    console.log("fetchSongLyric", res);
    this.setData({
      songLyric: res.lrc.lyric,
    });
  },

  //监听页面切换
  onSwiperChange(event) {
    // console.log(event)
    const currentPage = event.detail.current;
    this.setData({ currentPage });
  },

  // 导航栏切换
  onNavItemTap(event) {
    // console.log("onNavItemTap", event.currentTarget.dataset.index);
    const index = event.currentTarget.dataset.index;
    this.setData({ currentPage: index });
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

    // 播放音乐
    audioContext.stop();
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    audioContext.autoplay = true;

    // 播放进度
    audioContext.onTimeUpdate(() => {
      // console.log("onTimeUpdate", audioContext.currentTime);
    });

    // 设备信息
    this.setData({ statusHeight: app.globalData.statusBarHeight });
    this.setData({ contentHeight: app.globalData.contentHeight });
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
