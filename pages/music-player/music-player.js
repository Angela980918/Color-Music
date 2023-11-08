// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../service/api_player";
import { throttle } from "../../utils/throttle";
import { parseLyric } from "../../utils/parselyric";
import playerStore from "../../store/playerStore";
const app = getApp();
// 创建播放器
const audioContext = wx.createInnerAudioContext();
// 播放模式
const modelName = ["order", "repeat", "random"]; // 列表循环，
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0, // 歌曲id
    currentSong: {}, // 当前播放歌曲
    songLyric: [], //歌词
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

    playSongList: [], // 当前播放列表
    playSongIndex: 0, // 当前播放歌曲索引
    isFirstPlay: true, // 是否是第一次播放

    playModelIndex: 0, // 默认播放模式 0:列表循环 1:单曲循环 2:随机播放
    playModelName: "order", // 当前播放模式 默认列表循环
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
      isPlaying: true,
    });

    // 设置isSliderChanging
    this.setData({ isSliderChanging: false });
  },

  // 滑动滑块--节流操作
  onSliderChanging: throttle(function (event) {
    // 1.获取滑动滑块的位置
    const value = event.detail.value;
    // console.log(value);

    // 2.设置滑块进度
    const currentTime = (value / 100) * this.data.durationTime;
    this.setData({ currentTime });

    // 3.当前正在滑动
    this.setData({ isSliderChanging: true, isPlaying: true });
  }, 100),

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
  // 上一首
  onPrevBtnTap() {
    // console.log("点击了上一首");
    this.changeNewSong(false);
  },

  // 下一首
  onNextBtnTap() {
    // console.log("点击了下一首");
    this.changeNewSong();
  },

  // 判断点击 下一首 或者 上一首
  changeNewSong(isNext = true) {
    // 1.获取之前的数据
    const length = this.data.playSongList.length;
    let index = this.data.playSongIndex;

    // 2.根据之前的数据，重新计算索引
    switch (this.data.playModelIndex) {
      case 0: // 列表循环
        index = isNext ? index + 1 : index - 1;
        // 2.1 pageIndex不能为负数,index不能超过列表长度
        if (index === -1) {
          index = length - 1;
        }
        if (index === length) {
          index = 0;
        }
        break;
      case 1: // 单曲循环
        break;
      case 2: // 随机播放
        index = Math.floor(Math.random() * length);
        break;
    }

    // 3.根据索引获取上一首歌曲
    const newSong = this.data.playSongList[index];
    console.log(newSong.id);

    // 4.记录最新的索引
    playerStore.setState("playSongIndex", index);

    //4.1播放前将之前的数据初始化
    this.setData({
      currentSong: {},
      sliderValue: 0,
      currentTime: 0,
      duration: 0,
      isPlaying: true,
    });
    // 5.播放新歌曲
    this.setupPlaySong(newSong.id);
  },

  // 播放模式切换
  onModeBtnTap() {
    let modeIndex = this.data.playModelIndex;
    modeIndex++;
    if (modeIndex === 3) {
      modeIndex = 0;
    }
    this.setData({
      playModelIndex: modeIndex,
      playModelName: modelName[modeIndex],
    });
    console.log("playModelIndex", this.data.playModelIndex);
  },

  // ======================= store 监听事件 =======================
  getSongInfosHandler({ playSongList, playSongIndex }) {
    if (playSongList) {
      this.setData({ playSongList });
    }
    if (playSongIndex !== undefined) {
      this.setData({ playSongIndex });
    }
  },
  getPlayInfosHandler({
    id,
    currentSong,
    currentTime,
    durationTime,
    songLyric,
    currentLyricText,
    currentLyricIndex,
  }) {
    if (id !== undefined) {
      this.setData({ id });
    }
    if (currentSong) {
      this.setData({ currentSong });
    }
    if (currentTime !== undefined) {
      this.setData({ currentTime });
    }
    if (durationTime !== undefined) {
      this.setData({ durationTime });
    }
    if (songLyric) {
      this.setData({ songLyric });
    }
    if (currentLyricText) {
      this.setData({ currentLyricText });
    }
    if (currentLyricIndex !== undefined) {
      this.setData({
        currentLyricIndex,
        lyricScrollTop: 35 * currentLyricIndex, // 歌词滚动距离
      });
    }
  },

  // ======================= 播放歌曲 =======================
  setupPlaySong(id) {
    // 1.获取歌曲id
    this.setData({ id });

    this.fetchSongDetail(id);
    this.fetchSongLyric(id);

    // 播放音乐
    audioContext.stop();
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    audioContext.autoplay = true;

    // 监听歌曲
    const throttleUpdateProgress = throttle(this.updateProgress, 800, {
      leading: false,
      trailing: false,
    });

    if (this.data.isFirstPlay) {
      this.data.isFirstPlay = false;
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
      audioContext.onEnded(() => {
        // 自然播放结束后播放下一首
        this.changeNewSong();
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log("options", options);
    const id = options.id;

    // this.setupPlaySong(id);
    playerStore.dispatch("playMusicWithSongIdAction", id);
    // 获取store的共享数据
    playerStore.onStates(
      ["playSongList", "playSongIndex"],
      this.getSongInfosHandler
    );
    playerStore.onStates(
      [
        "id",
        "currentSong",
        "currentTime",
        "durationTime",
        "songLyric",
        "currentLyricText",
        "currentLyricIndex",
      ],
      this.getPlayInfosHandler
    );

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
  onUnload() {
    playerStore.offStates(
      ["playSongList", "playSongIndex"],
      this.getSongInfosHandler
    );
    playerStore.offStates(
      [
        "id",
        "currentSong",
        "currentTime",
        "durationTime",
        "songLyric",
        "currentLyricText",
        "currentLyricIndex",
      ],
      this.getPlayInfosHandler
    );
  },

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
