import { HYEventStore } from "hy-event-store";
import { getMusicMenuDetail } from "../service/api_music";

// 各榜单对应的idx
export const rankingsMap = {
  newRanking: 3779629,
  originRanking: 2884035,
  upRanking: 19723756,
};

const peakStore = new HYEventStore({
  state: {
    newRanking: {}, // 新歌榜
    originRanking: {}, // 原创榜
    upRanking: {}, // 飙升榜
  },
  actions: {
    fetchPeakRankDataAction(ctx) {
      for (const key in rankingsMap) {
        const id = rankingsMap[key];
        getMusicMenuDetail(id).then((res) => {
          // console.log("fetchPeakRankDataAction", res);
          ctx[key] = res.playlist;
        });
      }
    },
  },
});

export default peakStore;
