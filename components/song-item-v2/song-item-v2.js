// components/song-item-v2/song-item-v2.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songItem: {
      type: Object,
      value: {},
    },
    // 歌曲顺序
    index: {
      type: Number,
      value: 0,
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
    onSongItemClick() {
      const id = this.properties.songItem.id;
      // console.log("id", id);
            /**
       *  跳转至歌曲详情页
       */
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`,
      });
    },
  },
});
