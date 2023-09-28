import { HYEventStore } from "hy-event-store";

const playerStore = new HYEventStore({
  state: {
    playSongList: [], //当前播放列表
    playSongIndex: 0, //当前播放歌曲索引
  },
});

export default playerStore;
