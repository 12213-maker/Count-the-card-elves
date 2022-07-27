/*
 * @Author: your name
 * @Date: 2022-02-17 14:32:47
 * @LastEditTime: 2022-02-21 16:42:37
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \gz-index\ai-ui\src\api\point\index.js
 */
import request from "@/api/config";
const pointApi = {
  //    网格排名
  getGridRank(data) {
    return request.post("/getGridRank", data);
  },
  //    指标趋势
  getKpiTread(data) {
    return request.post("/getKpiTread", data);
  },
};
export default pointApi;
