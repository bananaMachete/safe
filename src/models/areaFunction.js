/* eslint-disable */
import * as areaService from '../services/areaService';

export default {

  namespace: "areaFunction",
  state: {
    initState: '',
    initAreaList:[],
    detailObj:{},
  },
  effects: {
    // 查询区域树形列表
    * querySmsAreaList({ payload }, { call, put }) {
      const rsp = yield call(areaService.getSmsAreaTreeDateInfo, payload);
      yield put({ type: 'initAreaList', payload: rsp.data });
    },
    // 模糊查询树形列表
    * getSmsAreaTreeDateInfo({ payload }, { call, put }) {
      const rsp = yield call(areaService.getSmsAreaTreeDateInfo, payload);
      yield put({ type: 'initAreaList', payload: rsp.data });
    },
    // 保存区域基础信息
      * saveSmsAreaInfo({ payload }, { call, put }) {
      const rsp = yield call(areaService.saveSmsAreaInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除区域基础信息
    * deleteSmsAreaInfo({ payload }, { call, put }) {
      const rsp = yield call(areaService.deleteSmsAreaInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //区域详情页
    * getSmsAreaInfo({ payload }, { call, put }) {
      const rsp = yield call(areaService.getSmsAreaInfo, payload);
      yield put({ type: 'detailObj', payload: rsp.data });
    },
    // 更新区域基础信息
    * updateSmsAreaInfo({ payload }, { call, put }) {
      const rsp = yield call(areaService.updateSmsAreaInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
  },
  reducers: {
    initState(state, { payload }) {
      return {
        ...state,
        initState: payload,
      };
    },
    initAreaList(state, { payload }) {
      return {
        ...state,
        initAreaList: payload,
      };
    },
    detailObj(state, {payload}) {
      return {
        ...state,
        detailObj:payload,
      };
    },
  }
}
