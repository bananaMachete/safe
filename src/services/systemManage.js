import request from "../util/request";

// 部门管理&单位管理
/**
 * 新增单位
 * @param data
 * @returns {Promise<*>}
 */
export function saveCompany(data) {
  return request('http://192.168.1.19:8080/dico-organization/company/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body:JSON.stringify(data)
  });
}

/**
 * 新增组织结构
 * @param data
 * @returns {Promise<*>}
 */
export function saveOrganization(data) {
  return request('http://192.168.1.19:8080/dico-organization/organization/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body:JSON.stringify(data)
  });
}

/**
 * 查询单位列表
 * @param data
 * @returns {Promise<*>}
 */
export function queryCompanyList(data) {
  return request('http://192.168.1.19:8080/dico-organization/company/dataPage?name='+data.name+'&pageNum=' + data.pageNum, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * 根据单位ID查询组织机构
 * @param data
 * @returns {Promise<*>}
 */
export function getOrganizationsById(data) {
  return request('http://192.168.1.19:8080/dico-organization/organization/findTreeList?companyId='+data.id, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * 删除单位
 * @param data
 * @returns {Promise<*>}
 */
export function deleteCompany(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-organization/company/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

/**
 * 修改单位
 * @param data
 * @returns {Promise<*>}
 */
export function updateCompany(data) {
  return request('http://192.168.1.19:8080/dico-organization/company/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 获取当前登录人所在单位
 * @param data
 * @returns {Promise<*>}
 */
export function getCurrentCompany(data) {
  return request('http://192.168.1.19:8080/dico-organization/company/getCurrentCompany', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * 删除组织机构
 * @param data
 * @returns {Promise<*>}
 */
export function deleteOrganization(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-organization/organization/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body: searchParams,
  });
}

/**
 * 修改组织机构
 * @param data
 * @returns {Promise<*>}
 */
export function updateOrganization(data) {
  return request('http://192.168.1.19:8080/dico-organization/organization/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

//用户管理

/**
 * 查询用户列表
 * @param data
 * @returns {Promise<*>}
 */
export function getUserList(data) {
  return request('http://192.168.1.19:8080/dico-system/user/dataPage?username=' + data.username + '&name=' + data.name + '&pageNum=' + data.pageNum, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * 新增用户
 * @param data
 * @returns {Promise<*>}
 */
export function saveUser(data) {
  return request('http://192.168.1.19:8080/dico-system/user/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body:JSON.stringify(data)
  });
}

/**
 * 删除用户
 * @param data
 * @returns {Promise<*>}
 */
export function deleteUser(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-system/user/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body:searchParams
  });
}

/**
 * 修改用户
 * @param data
 * @returns {Promise<*>}
 */
export function updateUser(data) {
  return request('http://192.168.1.19:8080/dico-system/user/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 获取用户当前绑定角色
 * @param data
 * @returns {Promise<*>}
 */
export function getBindRoles(data) {
  return request('http://192.168.1.19:8080/dico-system/user/getBindRoles?userId=' + data, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * 查询全部角色列表
 * @param data
 * @returns {Promise<*>}
 */
export function getRolesList(data) {
  return request('http://192.168.1.19:8080/dico-system/role/dataList?code=' + data.code + '&name=' + data.name, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * 用户绑定角色
 * @param data
 * @returns {Promise<*>}
 */
export function bindRoles(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('userId',data.userId);
  searchParams.set('roleIds',data.roleIds);
  return request('http://192.168.1.19:8080/dico-system/user/bindRoles', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'POST',
    body:searchParams
  });
}


//角色管理

/**
 * 查询角色列表
 * @param data
 * @returns {Promise<*>}
 */
export function getRoleList(data) {
  return request('http://192.168.1.19:8080/dico-system/role/dataPage?code=' + data.code + '&name=' + data.name + '&pageNum=' + data.pageNum, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * 新增角色
 * @param data
 * @returns {Promise<*>}
 */
export function saveRole(data) {
  return request('http://192.168.1.19:8080/dico-system/role/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body:JSON.stringify(data)
  });
}

/**
 * 修改角色
 * @param data
 * @returns {Promise<*>}
 */
export function updateRole(data) {
  return request('http://192.168.1.19:8080/dico-system/role/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body:JSON.stringify(data)
  });
}

/**
 * 删除角色
 * @param data
 * @returns {Promise<*>}
 */
export function deleteRole(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-system/role/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body:searchParams
  });
}
/**
 * 根据部门查询用户
 * @param data
 * @returns {Promise<*>}
 */
export function getUserListByOrg(data) {
  return request('http://192.168.1.19:8080/dico-system/user/dataList?organizationId=' + data.id, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

//数据字典

/**
 * 查询数据类型列表带分页
 * @param data
 * @returns {Promise<*>}
 */
export function getDataTypeList(data) {
  return request('http://192.168.1.19:8080/dico-data-dictionary/dataType/dataPage?&name=' + data.name + '&pageNum=' + data.pageNum, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * 查询数据类型列表不带分页
 * @param data
 * @returns {Promise<*>}
 */
export function getDataTypeListAll(data) {
  return request('http://192.168.1.19:8080/dico-data-dictionary/dataType/dataList?&name=' + data.name, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * 新增数据类型
 * @param data
 * @returns {Promise<*>}
 */
export function saveDataType(data) {
  return request('http://192.168.1.19:8080/dico-data-dictionary/dataType/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body:JSON.stringify(data)
  });
}

/**
 * 修改数据类型
 * @param data
 * @returns {Promise<*>}
 */
export function updateDataType(data) {
  return request('http://192.168.1.19:8080/dico-data-dictionary/dataType/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body:JSON.stringify(data)
  });
}

/**
 * 删除数据类型
 * @param data
 * @returns {Promise<*>}
 */
export function deleteDataType(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-data-dictionary/dataType/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body:searchParams
  });
}

/**
 * 查询数据字典列表
 * @param data
 * @returns {Promise<*>}
 */
export function getDataList(data) {
  return request('http://192.168.1.19:8080/dico-data-dictionary/data/dataPage?&typeId=' + data.typeId + '&name=' + data.name + '&pageNum=' + data.pageNum, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

/**
 * 新增数据字典
 * @param data
 * @returns {Promise<*>}
 */
export function saveData(data) {
  return request('http://192.168.1.19:8080/dico-data-dictionary/data/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body:JSON.stringify(data)
  });
}

/**
 * 修改数据字典
 * @param data
 * @returns {Promise<*>}
 */
export function updateData(data) {
  return request('http://192.168.1.19:8080/dico-data-dictionary/data/update', {
    headers: {
      "content-type": "application/json",
    },
    method: 'PUT',
    body:JSON.stringify(data)
  });
}

/**
 * 删除数据字典
 * @param data
 * @returns {Promise<*>}
 */
export function deleteData(data) {
  var searchParams = new URLSearchParams();
  searchParams.set('ids',data);
  return request('http://192.168.1.19:8080/dico-data-dictionary/data/remove', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'DELETE',
    body:searchParams
  });
}
/**
 * 查询用户
 * @param data
 * @returns {Promise<*>}
 */
export function getUserById(data) {
  return request('http://192.168.1.19:8080/dico-system/user/get?id=' + data.userId, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
