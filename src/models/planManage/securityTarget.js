import * as securityTargetService from '../../services/securityTargetService';


export default {
  namespace : 'securityTarget',
  state     : {
    initSecurityTarget:[],
    initState:'',
    currentCompany:'',
    detailObj:{},
  },
  effects: {
    // 查询目标库列表
    * querySecurityTarget({ payload }, { call, put }) {
      const rsp = yield call(securityTargetService.querySecurityTarget, payload);
      yield put({ type: 'initSecurityTarget', payload: rsp.data });
    },
    // 保存目标库
    * saveSecurityTarget({ payload }, { call, put }) {
      const rsp = yield call(securityTargetService.saveSecurityTarget, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除目标库
    * deleteSecurityTarget({ payload }, { call, put }) {
      const rsp = yield call(securityTargetService.deleteSecurityTarget, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改目标库
    * updateSecurityTarget({ payload }, { call, put }) {
      const rsp = yield call(securityTargetService.updateSecurityTarget, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    * getSecurityTargetInfo({ payload }, { call, put }){
      const rsp = yield call(securityTargetService.getSecurityTargetInfo, payload);
      yield put({ type: 'detailObj', payload: rsp.data });
    }
  },
  reducers: {
    initSecurityTarget(state, {payload}) {
      return {
        ...state,
        initSecurityTarget:payload,
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
    detailObj(state, {payload}) {
      return {
        ...state,
        detailObj:payload,
      };
    },
  }
};
