import request from "../util/request";

// 查询维保单位列表
export function queryMaintenance(data) {
  return request('http://192.168.1.19:8080/dico-organization/maintenance/dataPage?pageNum='+data.pageNum , {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存维保单位
export function saveMaintenance(data) {
  console.log("aaa");
  return request('http://192.168.1.19:8080/dico-organization/maintenance/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 删除维保单位
export function deleteMaintenance(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-organization/maintenance/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

// 修改维保单位
export function updateMaintenanceData(data) {
  console.log("aaa");
  return request('http://192.168.1.19:8080/dico-organization/maintenance/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
/**
 * 查询维保单位
 * @param data
 * @returns {Promise<*>}
 */
export function getMaintenanceById(data) {
  return request('http://192.168.1.19:8080/dico-organization/maintenance/get/id=' + data.id, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
