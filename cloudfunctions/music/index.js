// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 云函数入口函数
exports.main = async (event, context) => {
  // skip: 从当前第几条开始取
  // limit: 取多少条数据
  // orderBy: 排序， 第一个参数是用哪个字段排序，第二个参数是 正序（默认） 还是 倒序(desc)
  return await cloud
    .database()
    .collection("playlist")
    .skip(event.start)
    .limit(event.count)
    .orderBy("createTime", "desc")
    .get();
};
