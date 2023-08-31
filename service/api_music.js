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
