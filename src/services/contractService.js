import request from "../util/request";

// 查询维保单位列表
export function queryContract(data) {
  return request('http://192.168.1.19:8080/dico-organization/contract/dataPage?pageNum='+data.pageNum , {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存维保单位
export function saveContract(data) {
  return request('http://192.168.1.19:8080/dico-organization/contract/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 删除维保单位
export function deleteContract(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-organization/contract/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

// 修改维保单位
export function updateContractData(data) {
  return request('http://192.168.1.19:8080/dico-organization/contract/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
