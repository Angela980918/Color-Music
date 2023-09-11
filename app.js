// app.js
App({
  /**
   * 全局设备信息(设备宽度、高度等)
   */
  globalData: {
    screenWidth: 0, // 屏幕宽度
    screenHeight: 0, // 屏幕高度
    statusBarHeight: 0, // 状态栏高度
  },

  onLaunch() {
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        // console.log(res)
        this.globalData.statusBarHeight = res.statusBarHeight;
        this.globalData.screenWidth = res.screenWidth;
        this.globalData.screenHeight = res.screenHeight;
      },
    });
  },
});
