import request from "@/api/config";
// 查询报表
export function getKpiTask(data) {
  return request({
    url: '/task/getKpiTask',
    method: 'post',
    data,
  });
};
// 查询报表详情得分
export function getKpiTaskDetail(data) {
    return request({
      url: '/task/getKpiTaskDetail',
      method: 'post',
      data,
    });
  };
// 查询报表区域下钻
export function getKpiTaskAreaDown(data) {
    return request({
      url: '/task/getKpiTaskAreaDown',
      method: 'post',
      data,
    });
  };