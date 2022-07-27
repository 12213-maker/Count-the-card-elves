import request from '../config';

export function login(data = {}) {
  return request({
    url: '/login',
    method: 'post',
    params: data,
  });
}

// token验证
export function validateToken(data = {}) {
	return request({
		url: '/tokenValidate',
		method: 'post',
		data: data,
	});
}
