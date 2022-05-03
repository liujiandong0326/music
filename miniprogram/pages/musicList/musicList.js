// pages/musicList/musicList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musicList: [],
    listInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad({ playlistId }) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud
      .callFunction({
        name: 'music',
        data: {
          $url: 'musicList',
          playlistId,
        },
      })
      .then(res => {
        const pl = res.result.playlist
        this.setData({
          musicList: pl.tracks,
          listInfo: {
            coverImgUrl: pl.coverImgUrl,
            name: pl.name,
          },
        })
        wx.hideLoading()
      })
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
})
