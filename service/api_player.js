// 二次封装 player相关的网络请求
import { MusicRequest } from "./index";

/**
 * 根据歌曲id获取歌曲详情
 * 可以一次性请求多个歌曲详情(用","隔开)
 * @param {*} ids 歌曲id
 * @returns
 */
export function getSongDetail(ids) {
  return MusicRequest.get({
    url: "/song/detail",
    data: {
      ids,
    },
  });
}

/**
 * 根据歌曲id获取歌词信息
 * @param {*} id
 * @returns
 */
export function getSongLyric(id) {
  return MusicRequest.get({
    url: "/lyric",
    data: {
      id,
    },
  });
}
