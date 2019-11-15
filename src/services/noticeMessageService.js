import request from "../util/request";

// 查询通知列表
export function queryNoticeMessageList(data) {
  return request('http://192.168.1.19:8080/dico-notice-message/notice/dataPaget?pageNum='+data.pageNum, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}

// 保存通知基础信息
export function saveNoticeMessageInfo(data) {
  return request('http://192.168.1.19:8080/dico-notice-message/notice/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}
// 更新通知基础信息
export function updateNoticeMessageInfo(data) {
  return request('http://192.168.1.19:8080/dico-notice-message/notice/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 删除通知基础信息
export function deleteNoticeMessageInfo(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('id',data);
  console.log(data);
  return request('http://192.168.1.19:8080/dico-notice-message/notice/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

//查看通知信息
export function getNoticeMessageInfo(data) {
  return request('http://192.168.1.19:8080/dico-notice-message/notice/dataInfo?id='+data.id, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

//查看树形通知信息
export function getNoticeMessageTreeInfo(data) {
  return request('http://192.168.1.19:8080/dico-notice-message/notice/findTreeList', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
//根据用户ID查询通知
export function getNoticeMessageByUserId(data){
  return request('http://192.168.1.19:8080/dico-notice-message/notice/noticeMessageByUserId?userId='+data.userId+'&pageNum='+data.pageNum,{
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  })
}
