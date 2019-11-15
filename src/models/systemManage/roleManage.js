import * as roleManage from '../../services/systemManage';

export default {
  namespace : 'roleManage',
  state     : {
    initRoleList:[],
    initState:'',
  },
  effects: {
    // 查询角色列表
    * getRoleList({ payload }, { call, put }) {
      const rsp = yield call(roleManage.getRoleList, payload);
      yield put({ type: 'initRoleList', payload: rsp.data });
    },
    // 新增角色
    * saveRole({ payload }, { call, put }) {
      const rsp = yield call(roleManage.saveRole, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改角色
    * updateRole({ payload }, { call, put }) {
      const rsp = yield call(roleManage.updateRole, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除角色
    * deleteRole({ payload }, { call, put }) {
      const rsp = yield call(roleManage.deleteRole, payload);
      yield put({ type: 'initState', payload: rsp });
    },
  },
  reducers: {
    initRoleList(state, {payload}) {
      return {
        ...state,
        initRoleList:payload,
      };
    },
    initState(state, {payload}) {
      return {
        ...state,
        initState:payload,
      };
    }
  }
};
