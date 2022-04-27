// 云函数入口文件
const cloud = require("wx-server-sdk");
const axios = require("axios");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const URL = "https://apis.imooc.com/personalized?icode=07B5773D5F5F47E1";
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { data } = await axios.get(URL);

  if (data.code === 200) {
    const playlist = data.result;
    if (playlist.length) {

      for (let i = 0; i < playlist.length; i++) {
        const item = playlist[i];
        item.createTime = db.serverDate()
      }
      await db
        .collection("playlist")
        .add({
          data: [...playlist],
        })
        .then((res) => {
          console.log("插入成功");
        })
        .catch((err) => {
          console.log(err);
          console.error("插入失败");
        });
    }
  } else {
    console.log(data.msg);
  }
};
