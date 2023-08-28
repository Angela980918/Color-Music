// components/video-detail-info/video-detail-info.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detailInfo: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {
        console.log('myProperty changed:', newVal,oldVal);
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {},
});
