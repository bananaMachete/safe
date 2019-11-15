import request from "../util/request";

// 登录
export function toLogin(data) {
  return request('http://192.168.1.19:8080/dico-system/auth/login', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body:JSON.stringify(data)
  });
}


// 查询数据字典
export function getDataListAll(data) {
  return request('http://192.168.1.19:8080/dico-data-dictionary/data/dataList?typeId=' + data.typeId + "&name=" + data.name, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

// 获取当前登录人信息
export function getLoginUser(data) {
  return request('http://192.168.1.19:8080/dico-system/user/getLoginUser', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

//查附件
export function getAttachments(data){
  return request('http://192.168.1.19:8080/dico-file/printer/findAttachments?targetId='+data.targetId, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
