import * as global from '../../services/global';
import * as userManage from '../../services/systemManage';

export default {
  namespace : 'userManage',
  state     : {
    data:{},
    userList:[],
    initState:'',
    initBindRoles:[],
    initRolesList:[],
  },
  effects: {
    // 登录
    * toLogin({ payload }, { call, put }) {
      const rsp = yield call(global.toLogin, payload);
      yield put({ type: 'initToken', payload: rsp });
    },
    // 查询用户列表
    * getUserList({ payload }, { call, put }) {
      const rsp = yield call(userManage.getUserList, payload);
      yield put({ type: 'initUserList', payload: rsp.data });
    },
    // 新增用户
    * saveUser({ payload }, { call, put }) {
      const rsp = yield call(userManage.saveUser, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除用户
    * deleteUser({ payload }, { call, put }) {
      const rsp = yield call(userManage.deleteUser, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改用户
    * updateUser({ payload }, { call, put }) {
      const rsp = yield call(userManage.updateUser, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 获取用户当前绑定角色
    * getBindRoles({ payload }, { call, put }) {
      const rsp = yield call(userManage.getBindRoles, payload);
      yield put({ type: 'initBindRoles', payload: rsp.data });
    },
    // 获取角色列表
    * getRolesList({ payload }, { call, put }) {
      const rsp = yield call(userManage.getRolesList, payload);
      yield put({ type: 'initRolesList', payload: rsp.data });
    },
    // 用户绑定角色
    * bindRoles({ payload }, { call, put }) {
      const rsp = yield call(userManage.bindRoles, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 查询根据部门查询用户列表
    * getUserListByOrg({ payload }, { call, put }) {
      const rsp = yield call(userManage.getUserListByOrg, payload);
      yield put({ type: 'initUserList', payload: rsp.data });
    },
    // 查询根据ID查询用户
    * getUserById({ payload }, { call, put }) {
      const rsp = yield call(userManage.getUserById, payload);
      yield put({ type: 'initData', payload: rsp.data });
      console.log(rsp);
    },
  },
  reducers: {
    initToken(state, {payload}) {
      return {
        ...state,
        data:payload,
      };
    },
    initUserList(state, {payload}) {
      return {
        ...state,
        userList:payload,
      };
    },
    initState(state, {payload}) {
      return {
        ...state,
        initState:payload,
      };
    },
    initBindRoles(state, {payload}) {
      return {
        ...state,
        initBindRoles:payload,
      };
    },
    initRolesList(state, {payload}) {
      return {
        ...state,
        initRolesList:payload,
      };
    },
    initData(state, {payload}) {
      return {
        ...state,
        data:payload,
      };
    },
  }
};
