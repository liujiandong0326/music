// 云函数入口文件
const cloud = require("wx-server-sdk");
const TcbRouter = require("tcb-router");
const { default: axios } = require("axios");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const URL = "https://apis.imooc.com";
const ICODE = "07B5773D5F5F47E1";

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });

  app.router("playlist", async (ctx, next) => {
    // skip: 从当前第几条开始取
    // limit: 取多少条数据
    // orderBy: 排序， 第一个参数是用哪个字段排序，第二个参数是 正序（默认） 还是 倒序(desc)
    ctx.body = await cloud
      .database()
      .collection("playlist")
      .skip(event.start)
      .limit(event.count)
      .orderBy("createTime", "desc")
      .get();
  });

  app.router("musicList", async (ctx, next) => {
    ctx.body = await axios
      .get(URL + "/playlist/detail", {
        params: { id: event.playlistId, icode: ICODE },
      })
      .then((res) => res.data);
  });

  return app.serve();
};
