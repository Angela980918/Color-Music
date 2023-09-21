// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../service/api_player";
import { throttle } from "../../utils/throttle";
import { parseLyric } from "../../utils/parselyric";
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
    currentTime: 0, // 当前播放时间
    durationTime: 0, // 歌曲的总时长
    sliderValue: 0, // 播放进度(滑块进度条)

    statusHeight: 20, // 状态栏高度
    contentHeight: 0, // 内容区域高度
    currentPage: 0, // 默认选择歌曲
    isSliderChanging: false, // 正在改变滑块
    isPlaying: true, // 是否正在播放
    currentLyricText: "", // 当前歌词
    currentLyricIndex: 0, // 当前歌词索引

    lyricScrollTop: 0, // 歌词滚动距离
  },

  /**
   * 获取歌曲详情
   */
  async fetchSongDetail(id) {
    const res = await getSongDetail(id);
    // console.log("fetchSongDetail", res);
    this.setData({
      currentSong: res.songs[0],
      durationTime: res.songs[0].dt,
    });
  },

  /**
   * 获取歌词详情
   */
  async fetchSongLyric(id) {
    const res = await getSongLyric(id);
    // console.log("fetchSongLyric", res);
    const lrcString = res.lrc.lyric;
    const lyrics = parseLyric(lrcString);
    // console.log(lyrics);
    this.setData({
      songLyric: lyrics,
    });
  },

  //监听页面切换
  onSwiperChange(event) {
    // console.log(event)
    const currentPage = event.detail.current;
    this.setData({
      currentPage,
    });
  },

  // 导航栏切换
  onNavItemTap(event) {
    // console.log("onNavItemTap", event.currentTarget.dataset.index);
    const index = event.currentTarget.dataset.index;
    this.setData({
      currentPage: index,
    });
  },

  // 点击滑块
  onSliderChange(event) {
    console.log("onSliderChange");

    const value = event.detail.value;
    const currentTime = (value / 100) * this.data.durationTime;
    // console.log(value, currentTime);

    audioContext.seek(currentTime / 1000);

    // 设置滑块进度
    this.setData({
      currentTime: currentTime,
      sliderValue: value,
    });

    // 设置isSliderChanging
    this.setData({ isSliderChanging: false });
  },

  // 滑动滑块
  onSliderChanging(event) {
    // 1.获取滑动滑块的位置
    const value = event.detail.value;

    // 2.设置滑块进度
    const currentTime = (value / 100) * this.data.durationTime;
    this.setData({ currentTime });

    // 3.当前正在滑动
    this.setData({ isSliderChanging: true });
  },

  // 节流限制
  updateProgress() {
    // console.log(audioContext.currentTime);
    // 如果滑块正在滑动,则不修改播放进度
    if (!this.data.isSliderChanging) {
      // 播放进度、滑块进度
      const sliderValue =
        (this.data.currentTime / this.data.durationTime) * 100;
      this.setData({
        // 秒数==> 毫秒
        currentTime: audioContext.currentTime * 1000,
        sliderValue: sliderValue,
      });
    }
  },

  // 暂停或播放
  onPlayOrPauseTap() {
    if (audioContext.paused) {
      audioContext.play();
      this.setData({
        isPlaying: true,
      });
    } else {
      audioContext.pause();
      this.setData({
        isPlaying: false,
      });
    }
  },

  // 返回上一层
  onBackTap() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log("options", options);
    // 1.获取歌曲id
    const id = options.id;
    this.setData({
      id,
    });
    this.fetchSongDetail(id);
    this.fetchSongLyric(id);

    // 播放音乐
    // audioContext.stop();
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    audioContext.autoplay = true;

    // 监听歌曲
    const throttleUpdateProgress = throttle(this.updateProgress, 800, {
      leading: false,
      trailing: false,
    });
    audioContext.onTimeUpdate(() => {
      // 更新歌曲进度
      throttleUpdateProgress();

      // 匹配当前歌词
      if (!this.data.songLyric.length) return;
      let index = this.data.songLyric.length - 1;
      for (let i = 0; i < this.data.songLyric.length; i++) {
        const info = this.data.songLyric[i];
        if (info.time > audioContext.currentTime * 1000) {
          index = i - 1;

          break;
        }
      }
      if (index === this.data.currentLyricIndex) return;
      const currentLyricText = this.data.songLyric[index].text;
      this.setData({
        currentLyricText,
        currentLyricIndex: index,
        lyricScrollTop: 35 * index,
      });
    });

    audioContext.onWaiting(() => {
      // console.log("先暂停");
      // 先暂停
      audioContext.pause();
    });

    audioContext.onCanplay(() => {
      // console.log("继续播放");
      // 继续播放
      audioContext.play();
    });

    // 设备信息
    this.setData({
      statusHeight: app.globalData.statusBarHeight,
    });
    this.setData({
      contentHeight: app.globalData.contentHeight,
    });
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
