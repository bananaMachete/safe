import * as staffService from '../services/staffService';

export default {
  namespace : 'staff',
  state     : {
    data:{},
    staffList:[],
    initState:'',
  },
  effects: {
    // 查询用户列表
    * getStaffList({ payload }, { call, put }) {
      const rsp = yield call(staffService.getStaffList, payload);
      yield put({ type: 'initStaffList', payload: rsp.data });
    },
    // 新增用户
    * saveStaff({ payload }, { call, put }) {
      const rsp = yield call(staffService.saveStaff, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除用户
    * deleteStaff({ payload }, { call, put }) {
      const rsp = yield call(staffService.deleteStaff, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改用户
    * updateStaff({ payload }, { call, put }) {
      const rsp = yield call(staffService.updateStaff, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 查询根据ID查询用户
    * getStaffById({ payload }, { call, put }) {
      const rsp = yield call(staffService.getStaffById, payload);
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
    initStaffList(state, {payload}) {
      return {
        ...state,
        staffList:payload,
      };
    },
    initState(state, {payload}) {
      return {
        ...state,
        initState:payload,
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
