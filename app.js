// app.js
App({
  /**
   * 全局设备信息(设备宽度、高度等)
   */
  globalData: {
    screenWidth: 0, // 屏幕宽度
    screenHeight: 0, // 屏幕高度

  },

  onLaunch() {
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.screenWidth = res.screenWidth
        this.globalData.screenHeight = res.screenHeight
      }
    })
  },
});
