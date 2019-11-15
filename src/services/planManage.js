import request from "../util/request";

// 查询计划列表
export function queryInspectionPlan(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionPlan/dataPage?pageNum='+data.pageNum +'&pageSize='+data.pageSize+ '&planName='+data.planName + '&planCode='+data.planCode+'&planStatus='+data.planStatus, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存巡检计划
export function saveInspectionPlan(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionPlan/savePlanAndBindEquipments', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

//查看区域信息
export function getInspectionPlanInfo(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionPlan/dataInfo?smsInspectionPlanId='+data.id, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

// 删除设备基础信息
export function deleteInspectionPlan(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionPlan/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

// 修改巡检计划
export function updateInspectionPlan(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionPlan/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 查询计划列表
export function queryInspectionRecord(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionRecord/dataPage?pageNum='+data.pageNum + '&pageSize='+data.pageSize+'&planId=' + data.planId, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
//根据用户ID查询计划列表
export function queryInspectionPlanByUserId(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan//smsInspectionPlan/findByUserId?userId='+data.userId, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

