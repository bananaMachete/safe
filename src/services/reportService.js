import request from "../util/request";

// 查询报告列表
export function queryReport(data) {
  return request('http://192.168.1.19:8080/dico-organization/report/dataPage?pageNum='+data.pageNum , {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存维保单位
export function saveReport(data) {
  return request('http://192.168.1.19:8080/dico-organization/report/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 删除维保单位
export function deleteReport(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-organization/report/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

// 修改维保单位
export function updateReport(data) {
  return request('http://192.168.1.19:8080/dico-organization/report/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
