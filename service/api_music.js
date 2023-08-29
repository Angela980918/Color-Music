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
      type
    },
  });
}
