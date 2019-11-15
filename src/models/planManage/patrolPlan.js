import * as patrolPlan from '../../services/planManage';

export default {
  namespace : 'patrolPlan',
  state     : {
    inspectionPlan:[],
    initState:'',
    currentCompany:'',
    detailObj:{},
    initPlanRecord:[],
  },
  effects: {
    // 查询巡检计划列表
    * queryInspectionPlan({ payload }, { call, put }) {
      const rsp = yield call(patrolPlan.queryInspectionPlan, payload);
      yield put({ type: 'initInspectionPlan', payload: rsp.data });
    },
    // 保存巡检计划
    * saveInspectionPlan({ payload }, { call, put }) {
      const rsp = yield call(patrolPlan.saveInspectionPlan, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除巡检计划
    * deleteInspectionPlan({ payload }, { call, put }) {
      const rsp = yield call(patrolPlan.deleteInspectionPlan, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //查找巡检计划
    * getInspectionPlanInfo({ payload }, { call, put }) {
      const rsp = yield call(patrolPlan.getInspectionPlanInfo, payload);
      yield put({ type: 'detailObj', payload: rsp.data });
    },
    // 修改巡检计划
    * updateInspectionPlan({ payload }, { call, put }) {
      const rsp = yield call(patrolPlan.updateInspectionPlan, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //查询巡检记录
    * queryInspectionRecord({ payload }, { call, put }) {
      const rsp = yield call(patrolPlan.queryInspectionRecord, payload);
      yield put({ type: 'initPlanRecord', payload: rsp.data });
    },
    //根据用户查询巡检计划
    * queryInspectionPlanByUserId({ payload }, { call, put }) {
      const rsp = yield call(patrolPlan.queryInspectionPlanByUserId, payload);
      yield put({ type: 'initInspectionPlan', payload: rsp.data });
    },
  },
  reducers: {
    initInspectionPlan(state, {payload}) {
      return {
        ...state,
        inspectionPlan:payload,
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
    initPlanRecord(state, {payload}) {
      return {
        ...state,
        initPlanRecord:payload,
      };
    },
  }
};
