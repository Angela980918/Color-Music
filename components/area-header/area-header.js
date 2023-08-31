// components/area-header/area-header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认标题",
    },
    showRight: {
      type: Boolean,
      value: true,
    },
    rightText:{
      type: String,
      value: "更多",
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onRightClick(){
      // 发送事件给父组件
      // console.log("rightclick");
      this.triggerEvent("rightclick");
    }
  },
});
