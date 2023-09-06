import { HYEventStore } from "hy-event-store";
import { getMusicMenuDetail } from "../service/api_music";

const rankingStore = new HYEventStore({
  state: {
    recommendSongInfo: [],
  },

  actions: {
    fetchRecommendMusicAction(ctx) {
      getMusicMenuDetail(3778678).then((res) => {
        console.log("fetchRecommendMusicAction", res);
        ctx.recommendSongInfo = res.playlist
      });
    },
  },
});

export default rankingStore;
