/**
 * 将歌词转换为数组类型
 * @param {*} lrcstring
 * @returns
 */
export function parseLyric(lrcstring) {
  // 初始化歌词数组
  const lyricArray = [];

  const lyricLines = lrcstring.split("\n");

  // 时间匹配正则表达式
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  for (const lineString of lyricLines) {
    const match = timeReg.exec(lineString);
    if (!match) continue;
    const minute = match[1] * 60 * 1000;
    const second = match[2] * 1000;
    const millisecond = match[3].length === 2 ? match[3] * 10 : match[3] * 1;
    const time = minute + second + millisecond;
    const text = lineString.replace(timeReg, "");
    lyricArray.push({ time, text });
  }

  return lyricArray;
}
