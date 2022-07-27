import request from "@/api/config";
// 查询考核报表
export function getKpiTask(data) {
  return request({
    url: '/task/getKpiTask',
    method: 'post',
    data,
  });
};
// 查询考核报表详情得分
export function getKpiTaskDetail(data) {
  return request({
    url: '/task/getKpiTaskDetail',
    method: 'post',
    data,
  });
};
// 查询考核报表区域下钻
export function getKpiTaskAreaDown(data) {
    return request({
      url: '/task/getKpiTaskAreaDown',
      method: 'post',
      data,
    });
};

//新增报表专题时的地域对象查询列表
export function gettaskgetArea() {
  return request.get('/task/getArea')
}

//指标查询
export function getKpiDefine(data){
  return request({
    method:'post',
    url:'/task/getKpiDefine',
    data
  })
}

// 查询专题报表
export function getKpiSpecTask(data) {
  return request({
    url: '/task/getKpiSpecTask',
    method: 'post',
    data,
  });
};
// 查询专题报表详情得分
export function getKpiSpecTaskDetail(data) {
  return request({
    url: '/task/getKpiSpecTaskDetail',
    method: 'post',
    data,
  });
};
// 查询专题报表区域下钻
export function getKpiSpecTaskAreaDown(data) {
  return request({
    url: '/task/getKpiSpecTaskAreaDown',
    method: 'post',
    data,
  });
};

//新增指标角色查询
export function getRole(data){
    return request({
      url:'/task/getRole',
      method:'post',
      data
    })
}

//新增指标电话号码查询
export function getUserByTel(data){
  return request({
    url:'/task/getUserByTel',
    method:'post',
    data
  })
}

//新增报表专题
export function addSpecTask(data){
  return request({
    url:'/task/addSpecTask',
    method:'post',
    data
  })
}

//判断report导航栏是否有未读消息
export function getKpiSpecIsRead(data){
  return request({
    url:'/task/getKpiSpecIsRead',
    method:'post',
    data
  })
}

