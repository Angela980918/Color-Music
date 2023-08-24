// 二次封装 video相关的网络请求
import { MusicRequest } from "./index";

// 获取MV TOP榜单 limit->取出数量 offset->偏移量
export function getTopMV(limit = 10, offset = 0) {
  return MusicRequest.get({
    url: "/top/mv",
    data: {
      limit,
      offset,
    },
  });
}
