import request from "../util/request";

// 查询设备保养列表
export function querySmsEquipmentMaintainInfoList(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentMaintainInfo/dataPage?pageNum'+data.pageNum, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存设备保养信息
export function saveSmsEquipmentMaintainInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentMaintainInfo/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 更新设备保养信息
export function updateSmsEquipmentMaintainInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentMaintainInfo/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
// 删除设备保养信息
export function deleteSmsEquipmentMaintainInfo(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data.id);
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentMaintainInfo/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

//查看设备保养信息
export function getSmsEquipmentMaintainInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentMaintainInfo/dataInfo?smsEquipmentMaintainInfoId='+data.id, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/*******************************设备维修信息分界线************************************************/
// 查询设备保养列表
export function querySmsEquipmentRepairInfoList(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentRepairInfo/dataPage?pageNum'+data.pageNum, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
// 保存设备维修信息
export function saveSmsEquipmentRepairInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentRepairInfo/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}
// 更新设备维修信息
export function updateSmsEquipmentRepairInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentRepairInfo/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
// 删除设备维修信息
export function deleteSmsEquipmentRepairInfo(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data.id);
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentRepairInfo/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}
//查看设备维修信息
export function getSmsEquipmentRepairInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentRepairInfo/dataInfo?smsEquipmentRepairInfoId='+data.id, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
