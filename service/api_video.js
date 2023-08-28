// 二次封装 video相关的网络请求
import { MusicRequest } from "./index";

/**
 *  获取MV TOP榜单 limit->取出数量 offset->偏移量
 * @param {*} limit
 * @param {*} offset
 */
export function getTopMV(limit = 10, offset = 0) {
  return MusicRequest.get({
    url: "/top/mv",
    data: {
      limit,
      offset,
    },
  });
}

/**
 * 获取MV 播放地址
 * @param mvid
 */
export function getMVUrl(mvid) {
  return MusicRequest.get({
    url: "/mv/url",
    data: {
      id: mvid,
    },
  });
}

/**
 * 获取MV详情
 * @param mvid
 * @returns
 */
export function getMVInfo(mvid) {
  return MusicRequest.get({
    url: "/mv/detail",
    data: {
      mvid,
    },
  });
}

/**
 * 
 * @param {*} mvid 
 * @returns 
 */
export function getMVRelated(mvid) {
  return MusicRequest.get({
    url: "/related/allvideo",
    data: {
      id: mvid,
    },
  });
}
