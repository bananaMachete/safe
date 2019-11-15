import * as checkItemService from '../../services/checkItemService';


export default {
  namespace : 'checkItem',
  state : {
    inspectionTarget:[],
    initState:'',
    currentCompany:'',
    detailObj:{},
  },
  effects: {
    // 查询检查项列表
    * queryInspectionTarget({ payload }, { call, put }) {
      const rsp = yield call(checkItemService.queryInspectionTarget, payload);
      yield put({ type: 'initInspectionTarget', payload: rsp.data });
    },
    // 保存检查项
    * saveInspectionTarget({ payload }, { call, put }) {
      const rsp = yield call(checkItemService.saveInspectionTarget, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除检查项
    * deleteInspectionTarget({ payload }, { call, put }) {
      const rsp = yield call(checkItemService.deleteInspectionTarget, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改检查项
    * updateInspectionTarget({ payload }, { call, put }) {
      const rsp = yield call(checkItemService.updateInspectionTarget, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    * getInspectionTargetInfo({ payload }, { call, put }){
      const rsp = yield call(checkItemService.getInspectionTargetInfo, payload);
      yield put({ type: 'detailObj', payload: rsp.data });
    }
  },
  reducers: {
    initInspectionTarget(state, {payload}) {
      return {
        ...state,
        inspectionTarget:payload,
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
