// 二次封装 music相关的网络请求
import { MusicRequest } from "./index";

/**
 * 获取banner( 轮播图 ) 数据
 * @param {*} type
 * @returns
 */
export function getMusicBanner(type = 1) {
  return MusicRequest.get({
    url: "/banner",
    data: {
      type,
    },
  });
}

/**
 * 获取歌单详情
 * @param {*} id 歌单ID
 */
export function getMusicMenuDetail(id) {
  return MusicRequest.get({
    url: "/playlist/detail",
    data: {
      id,
    },
  });
}

/**
 * 获取歌单列表
 * @param {*} cat 歌单类型
 * @param {*} limit 歌单数量
 * @param {*} offset 偏移量
 * @returns
 */
export function getMusicMenu(cat = "全部", limit = 6, offset = 0) {
  return MusicRequest.get({
    url: "/top/playlist",
    data: {
      cat,
      limit,
      offset,
    },
  });
}

/**
 * 获取全部歌单列表
 * @returns 
 */
export function getMusicMenuTags(){
  return MusicRequest.get({
    url: "/playlist/hot",
  });
}
