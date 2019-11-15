import request from "../util/request";

// 查询报告列表
export function queryTrain(data) {
  return request('http://192.168.1.19:8080/dico-organization/train/dataPage?pageNum='+data.pageNum , {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存维保单位
export function saveTrain(data) {
  return request('http://192.168.1.19:8080/dico-organization/train/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 删除维保单位
export function deleteTrain(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-organization/train/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

// 修改维保单位
export function updateTrain(data) {
  return request('http://192.168.1.19:8080/dico-organization/train/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
