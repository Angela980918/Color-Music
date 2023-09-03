import { HYEventStore } from "hy-event-store";
import { getMusicMenuDetail } from "../service/api_music";

const rankingStore = new HYEventStore({
  state: {
    rankingList: [],
  },

  actions: {
    fetchRecommendMusicAction(ctx) {
      getMusicMenuDetail(3778678).then((res) => {
        console.log("fetchRecommendMusicAction", res);
        ctx.rankingList = res.playlist.tracks
      });
    },
  },
});

export default rankingStore;
