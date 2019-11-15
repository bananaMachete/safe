/* eslint-disable */
import * as contractService from '../services/contractService';

/**
 * 合同管理
 */
export default {

  namespace: "contract",
  state: {
    initState: '',
    initContractList:[],
  },
  effects: {
    // 查询维保单位列表
    * queryContractList({ payload }, { call, put }) {
      const rsp = yield call(contractService.queryContract, payload);
      yield put({ type: 'initContractList', payload: rsp.data });
    },
    // 保存维保单位信息
    * saveContract({ payload }, { call, put }) {
      const rsp = yield call(contractService.saveContract, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 更新维保单位信息
    * updateContract({ payload }, { call, put }) {
      const rsp = yield call(contractService.updateContractData, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除维保单位信息
    * deleteContract({ payload }, { call, put }) {
      const rsp = yield call(contractService.deleteContract, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //维保单位详情页
    * getContract({ payload }, { call, put }) {
      const rsp = yield call(contractService.queryContract, payload);
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
    initContractList(state, {payload}) {
      return {
        ...state,
        initContractList:payload,
      };
    },
  }
}
