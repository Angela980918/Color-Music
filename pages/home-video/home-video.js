// pages/home-video/home-video.js
// 请求接口
import { getTopMV } from "../../service/api_video";
import Toast from "@vant/weapp/toast/toast";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoList: [], //视频列表
    voffset: 0, // 初始化偏移量
    vlimit: 20, // 默认每页数量
    hasMore: true, //是否允许继续请求否则停止 默认为true
    isPullDown: false, //是否是下拉刷新
  },

  // 封装MV网络请求函数
  async fetchTopMVData(offset) {
    // 重置offset、hasMore
    if (offset === 0) {
      console.log("重置数据");
      this.setData({
        hasMore: true,
        voffset: offset,
      });
    }

    // 判断是否能够继续获取MV数据
    if (!this.data.hasMore) {
      return;
    }

    // 是否请求下拉刷新的操作
    if (this.data.isPullDown) {
      // 显示加载效果动画(标题栏处)
      wx.showNavigationBarLoading();
    } else {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
      });
    }

    // 1.获取数据
    const res = await getTopMV(this.data.vlimit, offset);

    // 2.更新数据
    let templeData = this.data.videoList;

    // 2.1初次加载
    if (offset === 0) {
      // console.log("0", res.hasMore);
      templeData = res.data;
    } else {
      // console.log("else", res.hasMore);
      templeData = templeData.concat(res.data);
    }

    // 3.更新数据
    this.setData({
      videoList: templeData,
      hasMore: res.hasMore,
      voffset: this.data.voffset + this.data.vlimit,
    });
  },

  // 事件监听
  onVideoItemClick(event) {
    // 获取视频id
    const id = event.currentTarget.dataset.item.id;
    // console.log("点击视频", id);
    // 跳转至视频详情页
    wx.navigateTo({
      url: `/pages/video-detail/video-detail?id=${id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 页面初次请求MV数据
    this.fetchTopMVData(0);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    // 设置isPullDown为true
    await this.setData({
      isPullDown: true,
    });

    // 下拉重置页面初始数据
    await this.fetchTopMVData(0);

    // 关闭加载效果动画
    wx.hideNavigationBarLoading();

    // 动画结束后，将isPullDown设置为false
    this.setData({
      isPullDown: false,
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log("页面滚动到底部");
    this.fetchTopMVData(this.data.voffset);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
