// components/video-related-item/video-related-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    relatedData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        console.log(newVal);
      },
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
