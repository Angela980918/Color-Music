// 固定接口地址
const BASE_URL = "https://www.codeman.ink/api"

// 封装请求类 利用Promise实现网络请求的返回
class MJRequest {
  constructor(baseURL) {
    this.BASE_URL = baseURL
  }

  request(options) {
    const { url } = options
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url: this.BASE_URL + url,
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  }
  get(options) {
    return this.request({ ...options, method: "get" })
  }
  post(options) {
    return this.request({ ...options, method: "post" })
  }
}

export const MusicRequest = new MJRequest(BASE_URL)
