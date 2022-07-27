import request from "@/api/config";

export function getKpiAreaDown(data) {
    return request({
        method:'post',
        url:'/getKpiAreaDown',
        data
    })
}