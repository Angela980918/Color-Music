/**
 * 获取页面容器矩形信息(Width or Height ...)
 * @param {*} selector 
 */
export function queryRect(selector) {
  return new Promise((resolve, reject) => {
    wx.createSelectorQuery()
      .select(selector)
      .boundingClientRect()
      .exec((res) => {
        resolve(res);
      });
  });
}
