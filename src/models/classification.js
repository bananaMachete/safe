/* eslint-disable */
import * as classificationService from '../services/classificationService';


export default {

  namespace: "classification",
  state: {
    initState: '',
    initClassList:[],
    initCheckItem:[],
  },
  effects: {
    // 查询设备分类树形列表
    * querySmsClassList({ payload }, { call, put }) {
      const rsp = yield call(classificationService.getSmsClassTreeInfo, payload);
      yield put({ type: 'initClassList', payload: rsp.data });
    },
    // 保存设备分类基础信息
    * saveSmsClassInfo({ payload }, { call, put }) {
      const rsp = yield call(classificationService.saveSmsClassInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改设备分类基础信息
    * updateSmsClassInfo({ payload }, { call, put }) {
      const rsp = yield call(classificationService.updateSmsClassInfo(), payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除设备分类基础信息
    * deleteSmsClassInfo({ payload }, { call, put }) {
      const rsp = yield call(classificationService.deleteSmsClassInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //设备分类详情页
    * getSmsClassInfo({ payload }, { call, put }) {
      const rsp = yield call(classificationService.getSmsClassInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //查询设备分类绑定指标信息
    * queryBindTargets({ payload }, { call, put }) {
      const rsp = yield call(classificationService.queryBindTargets, payload);
      yield put({ type: 'initCheckItem', payload: rsp.data });
    },
    /**
     * @description 绑定设备分类检查项
     * @author xipeifeng
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
      * bindInspectionTarget({ payload }, { call, put }) {
      const rsp = yield call(classificationService.bindInspectionTarget, payload);
      yield put({ type: 'initState', payload: rsp });
    },
  },
  reducers: {
    initState(state, {payload}) {
      return {
        ...state,
        initState:payload,
      };
    },
    initClassList(state, {payload}) {
      return {
        ...state,
        initClassList:payload,
      };
    },
    initCheckItem(state, {payload}) {
      return {
        ...state,
        initCheckItem:payload,
      };
    },
  }
}
