import request from '../config';


// 应知指标
export function getCheckKpiData(data) {
  return request({
    url: '/getCheckKpiData',
	  method: 'post',
	  data
  });
}

// 推荐指标
export function getRecommendKpiData(data) {
  return request({
    url: '/getRecommendKpiData',
    method: 'post',
    data
  });
}


// 关注指标
export function getFocusKpiData(data) {
  return request({
    url: '/getFocusKpiData',
    method: 'post',
    data
  });
}


// 全部指标
export function getAllKpiData(data) {
  return request({
    url: '/getAllKpiData',
    method: 'post',
    data
  });
}


// 获取某个指标详情
export function getKpiDataDetail(data) {
  return request({
    url: '/getKpiDataDetail',
    method: 'post',
    data
  });
}

// 获取某个指标详情
export function getKpiDetail(data) {
  return request({
    url: '/getKpiDetail',
    method: 'post',
    data
  });
}


// 获取多个指标详情
export function getKpiDataDetailList(data) {
  return request({
    url: '/getKpiDataDetailList',
    method: 'post',
    data
  });
}

// 关注指标
export function focusKpi(data) {
  return request({
    url: '/focusKpi',
    method: 'post',
    data
  });
}

// 取消关注指标
export function cancelFocus(data) {
  return request({
    url: '/cancelFocus',
    method: 'post',
    data
  });
}

// 指标名称联想
export function getKpiName(params) {
  return request({
    url: '/getKpiName',
    method: 'get',
    params
  });
}

// 查询区域
export function getAreaInfo(params) {
  return request({
    url: '/getAreaInfo',
    method: 'get',
    params
  });
}

// 查询自定义标签
export function getCustomLabel(data) {
  return request({
    url: '/getCustomLabel',
    method: 'post',
    data
  });
}

// 查询业务分类
export function getKpiType(data) {
  return request({
    url: '/getKpiType',
    method: 'post',
    data
  });
}

// 删除自定义指标
export function deleteCustomLabel(data) {
  return request({
    url: '/deleteCustomLabel',
    method: 'post',
    data
  });
}

// 新增自定义指标
export function addCustomLabel(data) {
  return request({
    url: '/addCustomLabel',
    method: 'post',
    data
  });
}


// 小卡浏览大卡
export function browseBigCard(data) {
  return request({
    url: '/browseBigCard',
    method: 'post',
    data
  });
}

