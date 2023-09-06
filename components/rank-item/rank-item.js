// components/rank-item/rank-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rankItem: {
      type: Object,
      value: {},
    },
    key: {
      // 榜单类型,默认为新歌榜
      type: String,
      value: "newRanking",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 歌单详情页跳转
     *  */
    onRankItemClick() {
      const key = this.properties.key;
      // console.log("onRankItemClick", key);
      wx.navigateTo({
        url: `/pages/songs-detail/songs-detail?type=ranking&key=${key}`,
      });
    },
  },
});
