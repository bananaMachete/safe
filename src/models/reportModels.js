/* eslint-disable */
import * as reportService from '../services/reportService';

/**
 * 报告管理
 */
export default {

  namespace: "report",
  state: {
    initState: '',
    initReportList:[],
  },
  effects: {
    // 查询维保单位列表
    * queryReportList({ payload }, { call, put }) {
      const rsp = yield call(reportService.queryReport, payload);
      yield put({ type: 'initReportList', payload: rsp.data });
    },
    // 保存维保单位信息
    * saveReport({ payload }, { call, put }) {
      const rsp = yield call(reportService.saveReport, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 更新维保单位信息
    * updateReport({ payload }, { call, put }) {
      const rsp = yield call(reportService.updateReport, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除维保单位信息
    * deleteReport({ payload }, { call, put }) {
      const rsp = yield call(reportService.deleteReport, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //维保单位详情页
    * getReport({ payload }, { call, put }) {
      const rsp = yield call(reportService.queryReport, payload);
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
    initReportList(state, {payload}) {
      return {
        ...state,
        initReportList:payload,
      };
    },
  }
}
