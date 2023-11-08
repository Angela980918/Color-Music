import { HYEventStore } from "hy-event-store";
import { parseLyric } from "../utils/parselyric";
import { getSongLyric, getSongDetail } from "../service/api_player";

// 创建播放器
const audioContext = wx.createInnerAudioContext();

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
  },

  actions: {
    playMusicWithSongIdAction(ctx, id) {
      ctx.id = id;

      // 1、请求歌曲详情
      getSongDetail(id).then((res) => {
        console.log(res);
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
          ctx.currentTime = audioContext.currentTime;

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
          // this.changeNewSong();
        });
      }
    },
  },
});

export default playerStore;
