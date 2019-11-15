import request from "../util/request";

// 查询设备列表
export function querySmsEquipmentBaseInfoList(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentBaseInfo/dataPage?pageNum='+data.pageNum+"&equipmentCode="+data.equipmentCode
    +"&equipmentName="+data.equipmentName+"&equipmentStatus="+data.equipmentStatus+"&scrapTime="+data.scrapTime+"&equipmentType="+data.equipmentType+"&installArea="+data.installArea, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存设备基础信息
export function saveSmsEquipmentBaseInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentBaseInfo/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// update设备基础信息
export function updateSmsEquipmentBaseInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment//smsEquipmentBaseInfo/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 删除设备基础信息
export function deleteSmsEquipmentBaseInfo(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data.id);
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentBaseInfo/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

//查看设备信息
export function getSmsEquipmentBaseInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentBaseInfo/dataInfo?smsEquipmentBaseInfoId='+data.id, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

//设备分类
export function equipmentClass(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentClass/findTreeList',{
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  })
}

//根据计划id查绑定的设备
export function querySmsEquipmentListByPlanId(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionPlan/findBindEquipments?planId='+data.planId, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

//根据计划id查分类系统
export function querySmsEquipmentClassListByPlanId(data) {
  return request('http://192.168.1.19:8080/sms-inspection-plan/smsInspectionPlan/findBindEquipmentClass?planId='+data.planId, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

//查询分类饼图
export function getEquipmentGroupClassAnalysis(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentBaseInfo/findEquipmentAnalysis', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
