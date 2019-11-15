import request from "../util/request";

// 查询安全计划列表
export function querySecurityPlan(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsSecurityPlan/findTreeList?pageNum='+data.pageNum + '&pageSize=' + data.pageSize+'&planCode='+data.planCode+'&planName='+data.planName+'&planStatus='+data.planStatus, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存安全计划
export function saveSecurityPlan(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsSecurityPlan/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 删除安全计划基础信息
export function deleteSecurityPlan(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsSecurityPlan/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

// 修改安全计划
export function updateSecurityPlan(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsSecurityPlan/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
