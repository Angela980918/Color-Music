// pages/home-music/home-music.js
import {
  getMusicBanner,
  getMusicMenuDetail,
  getMusicMenu,
} from "../../service/api_music";
import { queryRect } from "../../utils/query-rect";
import { throttle } from "../../utils/throttle";
import rankingStore from "../../store/rankingStore";
import peakStore from "../../store/peakStore";
// 防抖节流
const queryRectThrottle = throttle(queryRect);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "", // 查询关键字
    bannerImg: [], // 轮播图
    bannerHeight: 0, // 轮播图高度
    recommendSongList: [], // 推荐歌曲列表

    // 歌单
    hotSongMenus: [], // 热门歌单列表
    recSongMenus: [], // 推荐歌单列表

    // 巅峰榜数据(包括原创榜、新歌榜、飙升榜)
    rankingInfos: {},
  },

  // 搜索框事件监听
  onSearchClick() {
    wx.navigateTo({
      url: "/pages/search-detail/search-detail",
    });
  },

  // 获取banner数据
  async fetchBannerData() {
    const res = await getMusicBanner();
    this.setData({
      bannerImg: res.banners,
    });
  },

  // 获取歌单详情数据
  // async fetchMusicMenuDetailData() {
  //   const res = await getMusicMenuDetail(3778678);
  //   console.log(res);
  //   const playList = res.playlist;
  //   const TempSongList = playList.tracks.slice(0, 6);
  //   this.setData({
  //     recommendSongList: TempSongList,
  //   });
  // },

  // 获取热门歌单列表数据--"全部"
  async fetchHotSongMenuListData() {
    const res = await getMusicMenu();
    this.setData({
      hotSongMenus: res.playlists,
    });
  },

  // 获取推荐歌单列表数据--"欧美"
  async fetchResSongMenuListData() {
    const res = await getMusicMenu("欧美");
    this.setData({
      recSongMenus: res.playlists,
    });
  },

  // 动态适配机型，设置轮播图高度
  onBannerImageLoaded(event) {
    // 获取img的高度
    queryRectThrottle(".img").then((res) => {
      // console.log(res);
      this.setData({
        bannerHeight: res[0].height + "px",
      });
    });
  },
  // 推荐歌曲事件监听
  onRecommendClick() {
    console.log("onRecommendClick");
    wx.navigateTo({
      url: "/pages/songs-detail/songs-detail",
    });
  },

  /**
   * 从store中获取数据
   */
  handlerecommendSongList(value) {
    // console.log("value", value);
    if (!value) return;
    this.setData({
      recommendSongList: value.slice(0, 6),
    });
  },

  // handleNewRanking(value) {
  //   // console.log("新歌榜", value);
  //   // 解构rankingInfos，追加newRanking
  //   const newRankingInfos = { ...this.data.rankingInfos, newRanking: value };
  //   this.setData({
  //     rankingInfos: newRankingInfos,
  //   });
  // },

  // handleOriginRanking(value) {
  //   // console.log("原创榜", value);
  //   // 解构rankingInfos，追加originRanking
  //   const newRankingInfos = { ...this.data.rankingInfos, originRanking: value };
  //   this.setData({
  //     rankingInfos: newRankingInfos,
  //   });
  // },

  // handleUpRanking(value) {
  //   // console.log("飙升榜", value);
  //   // 解构rankingInfos，追加originRanking
  //   const newRankingInfos = { ...this.data.rankingInfos, upRanking: value };
  //   this.setData({
  //     rankingInfos: newRankingInfos,
  //   });
  // },

  /**
   * 榜单数据回调函数 (注：在回调函数中返回回调函数体，这样就可以在回调函数自带参数的基础上增添自己需要的参数)
   */
  getRankingHandle(ranking) {
    return (value) => {
      const newRankingInfos = { ...this.data.rankingInfos, [ranking]: value };
      this.setData({
        rankingInfos: newRankingInfos,
      });
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchBannerData();
    this.fetchHotSongMenuListData();
    this.fetchResSongMenuListData();
    // this.fetchMusicMenuDetailData();

    // Store发起数据请求
    rankingStore.onState("rankingList", this.handlerecommendSongList);
    rankingStore.dispatch("fetchRecommendMusicAction");
    // console.log("rankingStore", rankingStore);

    peakStore.onState("newRanking", this.getRankingHandle("newRanking"));
    peakStore.onState("originRanking", this.getRankingHandle("originRanking"));
    peakStore.onState("upRanking", this.getRankingHandle("upRanking"));
    peakStore.dispatch("fetchPeakRankDataAction");
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
    console.log("onUnload");
    rankingStore.offState("rankingList", this.recommendSongList);
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
