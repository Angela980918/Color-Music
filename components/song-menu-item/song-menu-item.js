// components/song-menu-item/song-menu-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 歌单数据
    menuItem: {
      type: Object,
      value: {},
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
     * 点击歌单跳转至歌单详情页
     */
    onMenuItemClick() {
      // console.log("点击歌单跳转");
      // console.log(this.properties.menuItem.id);
      const id = this.properties.menuItem.id;
      wx.navigateTo({
        url: `/pages/songs-detail/songs-detail?type=menu&id=${id}`,
      });
    },
  },
});
