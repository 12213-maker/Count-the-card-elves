import request from '../config';


// 应知指标
export function getMessage(data) {
  return request({
	  url: '/getMessage',
	  method: 'post',
	  data
  });
}

// 查询未读消息
export function getNotReadMsgNum(params) {
	return request({
		url: '/getNotReadMsgNum',
		method: 'get',
		params
	});
}
