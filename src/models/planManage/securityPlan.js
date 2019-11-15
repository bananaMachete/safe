import * as securityPlanService from '../../services/securityPlanService';

export default {
  namespace : 'securityPlan',
  state     : {
    initSecurityPlan:[],
    initState:'',
    currentCompany:'',
  },
  effects: {
    // 查询安全计划列表
    * querySecurityPlan({ payload }, { call, put }) {
      const rsp = yield call(securityPlanService.querySecurityPlan, payload);
      yield put({ type: 'initSecurityPlan', payload: rsp.data });
    },
    // 保存安全计划
    * saveSecurityPlan({ payload }, { call, put }) {
      const rsp = yield call(securityPlanService.saveSecurityPlan, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除安全计划
    * deleteSecurityPlan({ payload }, { call, put }) {
      const rsp = yield call(securityPlanService.deleteSecurityPlan, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改安全计划
    * updateSecurityPlan({ payload }, { call, put }) {
      const rsp = yield call(securityPlanService.updateSecurityPlan, payload);
      yield put({ type: 'initState', payload: rsp });
    },
  },
  reducers: {
    initSecurityPlan(state, {payload}) {
      return {
        ...state,
        initSecurityPlan:payload,
      };
    },
    initState(state, {payload}) {
      return {
        ...state,
        initState:payload,
      };
    },
    getCurrentCompany(state, {payload}) {
      return {
        ...state,
        currentCompany:payload,
      };
    },
  }
};
