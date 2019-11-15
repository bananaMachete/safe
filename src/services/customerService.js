import request from "../util/request";

// 查询维保单位列表
export function queryCustomer(data) {
  return request('http://192.168.1.19:8080/dico-organization/customer/dataPage?pageNum='+data.pageNum , {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存维保单位
export function saveCustomer(data) {
  return request('http://192.168.1.19:8080/dico-organization/customer/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 删除维保单位
export function deleteCustomer(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-organization/customer/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

// 修改维保单位
export function updateCustomerData(data) {
  return request('http://192.168.1.19:8080/dico-organization/customer/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
