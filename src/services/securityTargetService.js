import request from "../util/request";

// 查询安全目标库列表
export function querySecurityTarget(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsSecurityTarget/dataPage?targetCode='+data.targetCode+'&targetName='+data.targetName+'&targetType='+data.targetType+'&pageNum='+data.pageNum + '&pageSize=' + data.pageSize, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存安全目标
export function saveSecurityTarget(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsSecurityTarget/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 删除安全目标基础信息
export function deleteSecurityTarget(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsSecurityTarget/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

// 修改安全目标
export function updateSecurityTarget(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsSecurityTarget/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * @author stephen
 * @param data
 * @returns {Object}
 */
export function getSecurityTargetInfo(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsSecurityTarget/dataInfo?smsSecurityTargetId='+data.id, {
    headers: {
      "content-type": "application/json",
    },
    method: 'GET',
  });
}
