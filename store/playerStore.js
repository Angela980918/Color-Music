import { HYEventStore } from "hy-event-store";
import { parseLyric } from "../utils/parselyric";
import { getSongLyric, getSongDetail } from "../service/api_player";

// 创建播放器
export const audioContext = wx.createInnerAudioContext();
// BUG 进度条改变不会播放
// const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true, // 是否是第一次播放
    playSongList: [], //当前播放列表
    playSongIndex: 0, //当前播放歌曲索引

    id: 0,
    currentSong: {},
    songLyric: [], //歌词
    currentTime: 0, // 当前播放时间
    durationTime: 0, // 歌曲的总时长
    sliderValue: 0, // 播放进度(滑块进度条)

    currentLyricText: "", // 当前歌词
    currentLyricIndex: 0, // 当前歌词索引

    isPlaying: false, // 是否正在播放
    playModelIndex: 0, // 默认播放模式 0:列表循环 1:单曲循环 2:随机播放
  },

  actions: {
    // 播放音乐
    playMusicWithSongIdAction(ctx, id) {
      // 0、修改播放状态 & 重置
      ctx.isPlaying = true;
      ctx.currentSong = {};
      ctx.songLyric = [];
      ctx.durationTime = 0;
      ctx.currentTime = 0;
      ctx.currentLyricText = "";
      ctx.currentLyricIndex = 0;

      ctx.id = id;

      // 1、请求歌曲详情
      getSongDetail(id).then((res) => {
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
        audioContext.title = res.songs[0].name;
      });
      // 2、请求歌词信息
      getSongLyric(id).then((res) => {
        const lyricStr = res.lrc.lyric;
        const lyrics = parseLyric(lyricStr);
        ctx.songLyric = lyrics;
      });

      // 播放音乐
      audioContext.stop();
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.autoplay = true;

      if (ctx.isFirstPlay) {
        ctx.isFirstPlay = false;
        audioContext.onTimeUpdate(() => {
          // 获取当前播放的时间
          ctx.currentTime = audioContext.currentTime * 1000;

          // 匹配当前歌词
          if (!ctx.songLyric.length) return;
          let index = ctx.songLyric.length - 1;
          for (let i = 0; i < ctx.songLyric.length; i++) {
            const info = ctx.songLyric[i];
            if (info.time > audioContext.currentTime * 1000) {
              index = i - 1;
              break;
            }
          }
          if (index === ctx.currentLyricIndex) return;
          const currentLyricText = ctx.songLyric[index].text;
          ctx.currentLyricText = currentLyricText;
          ctx.currentLyricIndex = index;
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
          // 如果是单曲循环则不进行切换歌曲
          if (audioContext.loop) return;
          // 自然播放结束后播放下一首
          this.dispatch("changeNewSongAction");
        });
      }
    },

    // 播放状态
    changeMusicStatusAction(ctx) {
      if (!audioContext.paused) {
        audioContext.pause();
        ctx.isPlaying = false;
      } else {
        audioContext.play();
        ctx.isPlaying = true;
      }
    },

    // 播放模式
    changeMusicModelAction(ctx) {
      let modeIndex = ctx.playModelIndex;
      modeIndex++;
      if (modeIndex === 3) {
        modeIndex = 0;
      }

      // 设置单曲循环模式
      if (modeIndex === 1) {
        audioContext.loop = true;
      } else {
        audioContext.loop = false;
      }

      // 保存当前模式
      ctx.playModelIndex = modeIndex;
    },

    // 切换歌曲
    changeNewSongAction(ctx, isNext = true) {
      const length = ctx.playSongList.length;
      let index = ctx.playSongIndex;

      // 2.根据之前的数据，重新计算索引
      switch (ctx.playModelIndex) {
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
      const newSong = ctx.playSongList[index];

      // 4.播放新歌曲
      this.dispatch("playMusicWithSongIdAction", newSong.id);

      // 5.记录最新的索引
      this.setState("playSongIndex", index);
    },
  },
});

export default playerStore;
