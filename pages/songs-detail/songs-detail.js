// pages/songs-detail/songs-detail.js
import rankingStore from "../../store/rankingStore";
import peakStore from "../../store/peakStore";
import { getMusicMenuDetail } from "../../service/api_music";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: "ranking", // 数据类型,默认为榜单数据
    key: "newRanking", // 默认榜单类型为新歌榜
    id: "",
    songsList: [], // 歌曲列表
  },

  /**
   *  监听数据变化 => 保存至songsList
   * @param {type} value
   */
  handleSongList(value) {
    // console.log(value);
    this.setData({
      songsList: value,
    });
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: value.name,
    });
  },

  /**
   * 根据歌单ID获取歌单详情数据
   */
  async fetchMenuDetailData() {
    const res = await getMusicMenuDetail(this.data.id);
    // console.log("res", res);
    this.handleSongList(res.playlist);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 1.确定获取数据类型
    // type: ranking ==> 榜单数据
    // type: recommend ==> 推荐歌单
    const type = options.type;
    this.data.type = type;

    // 判断是否是为榜单
    if (type === "ranking") {
      // 获取榜单类型
      const key = options.key;
      this.data.key = key;
      peakStore.onState(key, this.handleSongList);
    } else if (type === "recommend") {
      // 否则为推荐歌单
      // console.log("recommend");
      rankingStore.onState("recommendSongInfo", this.handleSongList);
    } else if (type === "menu") {
      // console.log(options.id);
      const id = options.id;
      this.data.id = id;
      // console.log("id", id);
      // 网络请求
      this.fetchMenuDetailData();
    }
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
  onUnload() {
    if (this.data.type === "ranking") {
      peakStore.offState(this.data.key, this.handleSongList);
    } else {
      rankingStore.offState("recommendSongInfo", this.handleSongList);
    }
  },

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
