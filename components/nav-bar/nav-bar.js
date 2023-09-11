// components/nav-bar/nav-bar.js
const app = getApp();
Component({
  // 使用多个插槽需要添加multipleSlots属性
  options: {
    multipleSlots: true,
  },
  
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "导航标题",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusHeight: app.globalData.statusBarHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {},
});
