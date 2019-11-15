import request from "../util/request";


//维保人员管理
/**
 * 查询维保人员列表
 * @param data
 * @returns {Promise<*>}
 */
export function getStaffList(data) {
  return request('http://192.168.1.19:8080/dico-organization/staff/dataPage?pageNum=' + data.pageNum, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * 新增维保人员
 * @param data
 * @returns {Promise<*>}
 */
export function saveStaff(data) {
  return request('http://192.168.1.19:8080/dico-organization/staff/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body:JSON.stringify(data)
  });
}

/**
 * 删除维保人员
 * @param data
 * @returns {Promise<*>}
 */
export function deleteStaff(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-organization/staff/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body:searchParams
  });
}

/**
 * 修改维保人员
 * @param data
 * @returns {Promise<*>}
 */
export function updateStaff(data) {
  return request('http://192.168.1.19:8080/dico-organization/staff/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 查询维保人员
 * @param data
 * @returns {Promise<*>}
 */
export function getStaffById(data) {
  return request('http://192.168.1.19:8080/dico-organization/staff/get?id=' + data.userId, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
