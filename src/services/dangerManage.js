import request from "../util/request";

// 查询隐患列表
export function queryDangerList(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerInfo/dataPage?dangerLevel'+data.dangerLevel + '&dangerStatus=' + data.dangerStatus + '&pageNum=' + data.pageNum+ '&pageSize=' + data.pageSize+ '&remark=' + data.remark+ '&equipmentName=' + data.equipmentName+ '&dangerTypeName=' + data.dangerTypeName+ '&createDate=' + data.createDate+'&dangerTypeId='+data.dangerTypeId, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存隐患信息
export function saveDangerInfo(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerInfo/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 删除隐患信息
export function deleteDangerInfo(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerInfo/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

// 查询隐患详情
export function queryDangerDataInfo(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerInfo/dataInfo?smsDangerInfoId='+data.id, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
/****分割线*************隐患整改*****************/
// 查询隐患整改列表
export function queryDangerRepairList(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerRepair/dataPage?createDate='+data.createDate+'&repairStatus=' + data.repairStatus + '&pageNum=' + data.pageNum+ '&pageSize=' + data.pageSize+ '&dangerName=' + data.dangerName+'&repairUserName='+data.repairUserName, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存隐患整改信息
export function saveDangerRepairInfo(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerRepair/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}
// 查询详情
export function queryDangerRepairInfo(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerRepair/dataInfo?smsDangerRepairId='+data.id, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
//更新
export function updateDangerRepairInfo(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerRepair/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
// 删除隐患整改信息
export function deleteDangerRepairInfo(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerRepair/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}
/****分割线*************隐患复查*****************/
// 查询隐患整改列表
export function queryDangerReviewList(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerReview/dataPage?dangerLevel'+data.dangerLevel + '&dangerStatus=' + data.dangerStatus + '&pageNum=' + data.pageNum+'&dangerName='+data.dangerName+'&reviewUserName='+data.reviewUserName+'&reviewStatus='+data.reviewStatus+'&createDate='+data.createDate, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存隐患整改信息
export function saveDangerReviewInfo(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerReview/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}
// 查询详情
export function queryDangerReviewInfo(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerReview/dataInfo?smsDangerReviewId='+data.id, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
//更新
export function updateDangerReviewInfo(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerReview/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
// 删除隐患整改信息
export function deleteDangerReviewInfo(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerReview/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}
/****分割线*************统计功能*****************/
// 查询详情
export function findCountByUserId(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerInfo/findCountByUserId?userId='+data.userId, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

export function findDangerMouthAnalysis(data) {
  return request('http://192.168.1.19:8080/sms-danger-manager/smsDangerInfo/findDangerMouthAnalysis', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
