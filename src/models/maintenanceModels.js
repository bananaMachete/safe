/* eslint-disable */
import * as maintenanceService from '../services/maintenanceService';

export default {

  namespace: "maintenance",
  state: {
    initState: '',
    initMaintenanceList:[],
    data:{},
  },
  effects: {
    // 查询维保单位列表
    * queryMaintenanceList({ payload }, { call, put }) {
      const rsp = yield call(maintenanceService.queryMaintenance, payload);
      yield put({ type: 'initMaintenanceList', payload: rsp.data });
    },
    // 保存维保单位信息
    * saveMaintenance({ payload }, { call, put }) {
      const rsp = yield call(maintenanceService.saveMaintenance, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 更新维保单位信息
    * updateMaintenance({ payload }, { call, put }) {
      const rsp = yield call(maintenanceService.updateMaintenanceData, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除维保单位信息
    * deleteMaintenance({ payload }, { call, put }) {
      const rsp = yield call(maintenanceService.deleteMaintenance, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //维保单位详情页
    * getMaintenanceById({ payload }, { call, put }) {
      const rsp = yield call(maintenanceService.getMaintenanceById, payload);
      yield put({ type: 'initDate', payload: rsp });
    },

  },
  reducers: {
    initState(state, {payload}) {
      return {
        ...state,
        initState:payload,
      };
    },
    initMaintenanceList(state, {payload}) {
      return {
        ...state,
        initMaintenanceList:payload,
      };
    },
    initDate(state, {payload}){
      return {
        ...state,
        data:payload.data,
      }
    }
  }
}
