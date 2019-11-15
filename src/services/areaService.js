import request from "../util/request";

// 查询区域列表
export function querySmsAreaList(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsProjectArea/dataPage?pageNum'+data.pageNum, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存区域基础信息
export function saveSmsAreaInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsProjectArea/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 更新区域基础信息
export function updateSmsAreaInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsProjectArea/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 删除区域基础信息
export function deleteSmsAreaInfo(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data.id);
  return request('http://192.168.1.19:8080/sms-equipment/smsProjectArea/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

//查看区域信息
export function getSmsAreaInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsProjectArea/dataInfo?smsProjectAreaId='+data.id, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

//查看树形区域信息
export function getSmsAreaTreeInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsProjectArea/findTreeList?projectCode='+data.projectCode+'&projectName='+data.projectName+'&projectStatus='+data.projectStatus, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
//模糊查询
export function getSmsAreaTreeDateInfo(data) {
  return request('http://192.168.1.19:8080/sms-equipment/smsProjectArea/findTreeData?projectCode='+data.projectCode+'&projectName='+data.projectName+'&projectStatus='+data.projectStatus, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
