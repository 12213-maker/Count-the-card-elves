/*
 * @Author: your name
 * @Date: 2022-02-22 12:26:16
 * @LastEditTime: 2022-02-22 16:49:58
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \gz-index\ai-ui\src\api\channel\index.js
 */

import request from "@/api/config";
const channelApi = {
  //    查询应知渠道洞察
  getCheckChannelInsight(data) {
    return request.post("/getCheckChannelInsight", data);
  },
  //    查询应知渠道洞察
  getFocusChannelInsight(data) {
    return request.post("/getFocusChannelInsight", data);
  },
  //    查询应知渠道洞察
  getAllChannelInsight(data) {
    return request.post("/getAllChannelInsight", data);
  },
  //    查询应知渠道洞察
  getAreaInfo(params) {
    return request.get("/getAreaInfo", { params });
  },

  getChannelUpdateDate() {
    return request.get("/getChannelUpdateDate");
  },
};
export default channelApi;
