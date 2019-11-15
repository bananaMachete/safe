import request from "../util/request";

// 查询检查项列表
export function queryInspectionTarget(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionTarget/dataPage?pageNum='+data.pageNum + '&equipmentClassId=' + data.equipmentClassId+'&targetCode='+data.targetCode+'&targetName='+data.targetName, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存检查项
export function saveInspectionTarget(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionTarget/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 删除检查设备
export function deleteInspectionTarget(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionTarget/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

// 修改检查设备
/**
 * @author xipeifeng
 * @param data
 * @returns {Object}
 */
export function updateInspectionTarget(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionTarget/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}


export function getInspectionTargetInfo(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionTarget/dataInfo?smsInspectionTargetId='+data.id, {
    headers: {
      "content-type": "application/json",
    },
    method: 'GET',
  });
}
