import request from "../util/request";

// 查询设备分类列表
export function querySmsClassList(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentClass/dataPage?pageNum'+data.pageNum, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存设备分类基础信息
export function saveSmsClassInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentClass/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 删除设备分类基础信息
export function deleteSmsClassInfo(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data.id);
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentClass/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

//查看设备分类信息
export function getSmsClassInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentClass/dataInfo?smsEquipmentBaseInfoId='+data.id, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * @author Stephen
 * 查看树形设备分类信息
 * @param data
 * @returns {Object}
 */
export function getSmsClassTreeInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentClass/findTreeList?className='+data.className, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
/**
 * 修改设备分类
 * @author Stephen
 * @param data
 */
export function updateSmsClassInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentClass/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * @author xipeifeng
 * 查询设备分类绑定检查项
 * @param data
 * @returns {Object}
 */
export function queryBindTargets(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentClass/findBindTargets?equipmentClassId='+data.equipmentClassId, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
/**
 * @author xipeifeng
 * @param data
 * @returns {Object}
 */
export function bindInspectionTarget(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsEquipmentClass/bindTargets?equipmentClassId='+data.id+"&targetIds="+data.checkItemIds, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'POST',
  });
}
