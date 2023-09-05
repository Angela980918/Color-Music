// components/song-menu-area/song-menu-area.js
// 实例化app对象 获取app.js中公共数据
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menuTitle: {
      type: String,
      value: "默认歌单标题",
    },
    songMenuList: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    screenWidth: app.globalData.screenWidth, // 屏幕宽度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击更多
    OnMenuMoreClick(){
      // console.log("OnMenuMoreClick");
      wx.navigateTo({
        url: "/pages/menu-detail/menu-detail",
      })
    }

  },
});
