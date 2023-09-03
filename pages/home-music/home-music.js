// pages/home-music/home-music.js
import { getMusicBanner, getMusicMenuDetail, getMusicMenu } from "../../service/api_music";
import { queryRect } from "../../utils/query-rect";
import { throttle } from "../../utils/throttle";
import rankingStore from "../../store/rankingStore";
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
    hotSongMenus: [] // 热门歌单列表
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

  // 获取热门歌单列表数据
  async fetchHotSongMenuListData() {
    const res = await getMusicMenu();
    // console.log("getMusicMenu",res);
    this.setData({
      hotSongMenus: res.playlists
    })
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
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchBannerData();
    this.fetchHotSongMenuListData();
    // this.fetchMusicMenuDetailData();

    // Store发起数据请求
    rankingStore.onState("rankingList", (value) => {
      // 监听Store中的rankingList
      // console.log("rankingList", value);
      this.setData({
        recommendSongList: value.slice(0, 6),
      });
    });
    rankingStore.dispatch("fetchRecommendMusicAction");
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
