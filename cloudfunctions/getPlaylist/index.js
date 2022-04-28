// 云函数入口文件
const cloud = require("wx-server-sdk");
const axios = require("axios");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const URL = "https://apis.imooc.com/personalized?icode=07B5773D5F5F47E1";
const db = cloud.database();
const playlistCollection = db.collection("playlist");
const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
  const { data } = await axios.get(URL);

  if (data.code === 200) {
    const playlist = data.result;
    if (playlist.length) {
      // const list = await playlistCollection.get(); // 最多可以获取 100 条
      const countResult = await playlistCollection.count();
      const total = countResult.total;
      const requestNum = Math.ceil(total / MAX_LIMIT);
      const tasks = [];

      for (let i = 0; i < requestNum; i++) {
        // skip: 当前从第几条开始取
        // limit: 取的条数
        tasks.push(
          playlistCollection
            .skip(i * MAX_LIMIT)
            .limit(MAX_LIMIT)
            .get()
        );
      }
      let list = {
        data: [],
      };
      if (tasks.length) {
        list = await (await Promise.all(tasks)).reduce((prev, current) => ({
          data: prev.data.concat(current.data),
        }));
      }

      // 去重：如果数据库里边已经有相同的数据则不要插入
      const newData = [];
      for (let i = 0; i < playlist.length; i++) {
        let flag = true;
        for (let j = 0; j < list.data.length; j++) {
          if (playlist[i].id === list.data[j].id) {
            flag = false;
            break;
          }
        }
        if (flag) {
          playlist[i].createTime = db.serverDate();
          newData.push(playlist[i]);
        }
      }

      if(newData.length) {
        await playlistCollection
        .add({
          data: [...newData],
        })
        .then((res) => {
          console.log("插入成功");
        })
        .catch((err) => {
          console.log(err);
          console.error("插入失败");
        });
      }
      return newData.length;
    }
  } else {
    console.error(data.msg);
  }
};
