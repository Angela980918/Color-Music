// pages/video-detail/video-detail.js
import { getMVUrl, getMVInfo, getMVRelated } from "../../../service/api_video";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0, // 视频id
    mvUrl: "", // 视频地址
    danmuList: [
      { text: "哈哈哈, 真好听", color: "#ff0000", time: 3 },
      { text: "呵呵呵, 不错哦", color: "#ffff00", time: 10 },
      { text: "嘿嘿嘿, 好喜欢", color: "#0000ff", time: 15 },
    ],
    mvInfo: {}, // MV详情
    mvRelated: [] // MV相关推荐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 1.获取视频id
    const id = options.id;
    this.setData({
      id: id,
    });

    this.fetchMVUrl(id);
    this.fetchMVInfo(id);
    this.fetchMVRelated(id);

    console.log("length:",this.data.mvRelated.length);
  },

  // 封装页面请求MV详情数据
  async fetchMVUrl(mvid) {
    // 1.请求视频url
    const res = await getMVUrl(mvid);
    this.setData({
      mvUrl: res.data.url,
    });
  },

  async fetchMVInfo(mvid) {
    // 1.请求视频详情
    const res = await getMVInfo(mvid);
    // console.log(res);
    this.setData({
      mvInfo: res.data,
    });
  },

  async fetchMVRelated(mvid) {
    // 1.请求视频相关推荐
    const res = await getMVRelated(mvid);
    console.log(res);
    this.setData({
      mvRelated: res.data,
    });
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
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
